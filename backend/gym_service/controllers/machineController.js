const Machine = require('../models/Machine');
const Booking = require('../models/Booking');
// Helper generico per inviare richieste webhook al live_service usando un Shared Secret
const sendWebhook = (payload) => {
  const baseUrl = process.env.LIVE_SERVICE_URL || 'http://live-room-service:5003';
  const webhookUrl = `${baseUrl}/internal/webhook/notify`;
  
  return fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_API_KEY
    },
    body: JSON.stringify(payload)
  }).catch(err => {
    console.error(`Failed to send webhook event ${payload.event}: ${err.message}`);
  });
};

// Webhook: notifica il servizio live_service del cambio di stato di un macchinario per l'aggiornamento real-time dei client
const broadcastMachineUpdate = (machine) => {
  sendWebhook({
    event: 'machine_status_update',
    data: {
      machineId: machine._id,
      machineName: machine.name,
      timestamp: new Date().toISOString()
    }
  });
};

// Popola i campi del macchinario in memoria, invia l'aggiornamento live e risponde al client
const sendMachineUpdate = (machine, res) => {
  return machine.populate('activeUser queue', 'firstName lastName')
    .then(populatedMachine => {
      broadcastMachineUpdate(populatedMachine);
      res.status(200).json({
        success: true,
        data: populatedMachine
      });
    });
};

// Gestisce gli errori interni del server (500) inviando la risposta standard
const handleServerError = (res, error, logMessage) => {
  console.error(`${logMessage}: ${error.message}`);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
};

// Recupera tutti i macchinari con i relativi utenti attivi e code
exports.getAllMachines = (req, res) => {
  Machine.find()
    .populate('activeUser', 'firstName lastName')
    .populate('queue', 'firstName lastName')
    .then(machines => {
      res.status(200).json({
        success: true,
        data: machines
      });
    })
    .catch(error => handleServerError(res, error, 'Error retrieving machines'));
};



// Occupa un macchinario avviando una sessione di utilizzo
exports.useMachine = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id.toString();

  Machine.findOne({
    activeUser: userId,
    _id: { $ne: id }
  })
    .then(existing => {
      if (existing) {
        throw new Error('ALREADY_OCCUPYING');
      }
      return Machine.findById(id);
    })
    .then(machine => {
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }

      if (machine.status === 'in use') {
        return res.status(409).json({
          success: false,
          message: 'Machine is already in use'
        });
      }

      if (machine.queue.length > 0 && machine.queue[0].toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: 'You are not first in the queue'
        });
      }

      if (machine.queue.length > 0 && machine.queue[0].toString() === userId) {
        machine.queue.shift();
      }

      machine.status = 'in use';
      machine.activeUser = userId;
      machine.lastUpdated = Date.now();
      return machine.save();
    })
    .then(updatedMachine => sendMachineUpdate(updatedMachine, res))
    .catch(error => {
      if (error.message === 'ALREADY_OCCUPYING') {
        return res.status(400).json({
          success: false,
          message: 'Stai già occupando un altro macchinario'
        });
      }
      return handleServerError(res, error, 'Error using machine');
    });
};

// Rilascia un macchinario e notifica gli utenti in coda
exports.releaseMachine = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id.toString();
  let oldQueue = [];

  Machine.findById(id)
    .then(machine => {
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }

      if (machine.status !== 'in use') {
        return res.status(409).json({
          success: false,
          message: 'Machine is not in use'
        });
      }

      if (machine.activeUser.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not the current user of this machine'
        });
      }

      oldQueue = [...machine.queue];
      machine.queue = [];

      machine.status = 'available';
      machine.activeUser = null;
      machine.lastUpdated = Date.now();
      return machine.save();
    })
    .then(updatedMachine => {
      if (oldQueue.length > 0) {
        sendWebhook({
          event: 'machine_freed_alert',
          userIds: oldQueue,
          data: {
            machineId: updatedMachine._id,
            machineName: updatedMachine.name,
            timestamp: new Date().toISOString()
          }
        });
        console.log(`Webhook sent: notifying ${oldQueue.length} users that machine ${id} is available`);
      }
      return sendMachineUpdate(updatedMachine, res);
    })
    .catch(error => handleServerError(res, error, 'Error releasing machine'));
};

// Aggiunge un utente alla coda di un macchinario
exports.joinQueue = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id.toString();

  Machine.findById(id)
    .then(machine => {
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }

      if (machine.status === 'available') {
        return res.status(409).json({
          success: false,
          message: 'Machine is available, use it directly'
        });
      }

      if (machine.queue.includes(userId)) {
        return res.status(409).json({
          success: false,
          message: 'You are already in the queue'
        });
      }

      machine.queue.push(userId);
      machine.lastUpdated = Date.now();
      return machine.save();
    })
    .then(updatedMachine => sendMachineUpdate(updatedMachine, res))
    .catch(error => handleServerError(res, error, 'Error joining queue'));
};

// Rimuove un utente dalla coda di un macchinario
exports.leaveQueue = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id.toString();

  Machine.findById(id)
    .then(machine => {
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }

      const userIndex = machine.queue.indexOf(userId);
      if (userIndex === -1) {
        return res.status(409).json({
          success: false,
          message: 'You are not in the queue'
        });
      }

      machine.queue.splice(userIndex, 1);
      machine.lastUpdated = Date.now();
      return machine.save();
    })
    .then(updatedMachine => sendMachineUpdate(updatedMachine, res))
    .catch(error => handleServerError(res, error, 'Error leaving queue'));
};

// Crea una prenotazione per un macchinario
exports.bookMachine = (req, res) => {
  const userId = req.user.id.toString();
  const { machineId, date, duration } = req.body;

  if (!machineId || !date || !duration) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: machineId, date, duration'
    });
  }

  Booking.create({
    user: userId,
    machine: machineId,
    date,
    duration
  })
    .then(booking => {
      res.status(201).json({
        success: true,
        data: booking
      });
    })
    .catch(error => handleServerError(res, error, 'Error creating booking'));
};

// Annulla una prenotazione esistente (soft delete)
exports.cancelBooking = (req, res) => {
  const { id } = req.params;

  Booking.findByIdAndUpdate(id, { active: false }, { new: true })
    .then(booking => {
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully'
      });
    })
    .catch(error => handleServerError(res, error, 'Error cancelling booking'));
};
