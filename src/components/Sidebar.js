// src/components/Sidebar.js

import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';


const Sidebar = ({ checked, layerBaseHandleChange, layerHandleChange }) => {
  return (
    <div id="left" className="sidebar flex-center left collapsed">
      <div className="sidebar-guion flex-center">
        <div
          className="sidebar-toggle rounded-rect left"
          onClick={() => window.toggleSidebar('left')}
        >
          &rarr;
        </div>
      </div>
      <div
        className="sidebar-content rounded-rect"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper elevation={3} style={{ width: '80%', height: '80%', position: 'relative' }}>
          <fieldset className="select-fieldset selectFieldsetStyle">
            <Box sx={{ minWidth: 120 }}>
              
              <FormGroup>
                <FormControlLabel control={<Switch
                checked={checked}
                onChange={layerBaseHandleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />} label="Satelite/Calles" />
            </FormGroup>
              <Divider>.</Divider>
              <FormGroup>
                <FormControlLabel
                  size="small"
                  name="cca_unidadconstruccion"
                  control={<Checkbox defaultChecked />}
                  label="U Construcción"
                  onChange={layerHandleChange}
                />
                <FormControlLabel
                  size="small"
                  name="cca_terreno"
                  control={<Checkbox defaultChecked />}
                  label="Terreno"
                  onChange={layerHandleChange}
                />
                <FormControlLabel
                  size="small"
                  name="cca_ortofoto_cog"
                  control={<Checkbox defaultChecked />}
                  label="Ortofoto"
                  onChange={layerHandleChange}
                />
              </FormGroup>
            </Box>
          </fieldset>
        </Paper>
      </div>
    </div>
  );
};

export default Sidebar;
