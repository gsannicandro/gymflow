import React from 'react';
import { Box, Typography } from '@mui/material';
import BrutalCard from './ui/BrutalCard';

// Card generica basata su una modularità condizionale: visualizza e adatta il layout solo per le sezioni fornite via prop.
// Viene riutilizzata in diverse pagine: Home, Workouts, CourseCard, MachineCard, OwnerDashboard.
// - header: testata opzionale (es. istruttore o chat)
// - body: titolo, icona e elenco dettagli
// - footer: pulsanti di azione posizionati in fondo alla card
// - children: fallback per inserire JSX libero senza usare la struttura 'body'
const AppCard = ({ header, body, footer, children, onClick, sx = {}, color = 'white', ...props }) => {
  return (
    <BrutalCard 
      onClick={onClick} 
      color={color}
      sx={{ p: 0, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', ...sx }} 
      {...props}
    >
      {(header || children) && (
        <Box 
          sx={{ 
            backgroundColor: header?.bgColor || 'transparent', 
            borderBottom: header ? '4px solid black' : 'none', 
            p: header?.p !== undefined ? header.p : 2, 
            display: 'flex', 
            justifyContent: header?.align || 'space-between', 
            alignItems: 'center' 
          }}
        >
          {header?.content ? (
            header.content
          ) : (
            <Typography 
              sx={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                textTransform: 'uppercase', 
                fontSize: '1.2rem', 
                letterSpacing: '-0.025em' 
              }}
            >
              {header?.text}
            </Typography>
          )}
          {header?.action && <Box>{header.action}</Box>}
        </Box>
      )}

      {body && (
        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          
          {(body.title || body.icon) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: body.details || body.content ? 3 : 0 }}>
              {body.icon && (
                <Box 
                  sx={{ 
                    border: '4px solid black', 
                    borderRadius: 0, 
                    boxShadow: '4px 4px 0px 0px black', 
                    color: '#a3e635', 
                    backgroundColor: 'black',
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {body.icon}
                </Box>
              )}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                {body.title && (
                  <Typography 
                    sx={{ 
                      fontFamily: '"Archivo Black", sans-serif', 
                      fontSize: body.icon ? '1.5rem' : '2rem', 
                      fontStyle: 'italic', 
                      textTransform: 'uppercase', 
                      letterSpacing: '-0.025em', 
                      mb: body.subtitle ? 1 : 0, 
                      lineHeight: 1.1,
                      wordBreak: 'break-word'
                    }}
                  >
                    {body.title}
                  </Typography>
                )}
                {body.subtitle && (
                  <Typography sx={{ fontWeight: 'bold', color: '#444', textTransform: 'uppercase', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                    {body.subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {body.details && body.details.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: footer ? 4 : 0 }}>
              {body.details.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {detail.icon && (
                    <Box sx={{ color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 24 }}>
                      {detail.icon}
                    </Box>
                  )}
                  {typeof detail.text === 'string' ? (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'uppercase', color: detail.color || 'black' }}>
                      {detail.text}
                    </Typography>
                  ) : (
                    detail.text
                  )}
                </Box>
              ))}
            </Box>
          )}

          {body.content && (
            <Box sx={{ mb: footer ? 4 : 0 }}>
              {body.content}
            </Box>
          )}

          {footer && footer.actions && (
            <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {footer.actions.map((action, index) => (
                <Box key={index} sx={{ flexGrow: 1, display: 'flex', '& > *': { width: '100%' } }}>
                  {action}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {!body && children}
    </BrutalCard>
  );
};

export default AppCard;
