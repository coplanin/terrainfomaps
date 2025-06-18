// src/components/Sidebar.tsx

import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Tooltip from '@mui/material/Tooltip'
import { IconButton, InputAdornment } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

interface SidebarProps {
  checked: boolean
  layerBaseHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  layerHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  searchHandleLayer: (target: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ checked, layerBaseHandleChange, layerHandleChange, searchHandleLayer }) => {
  const [rotate, setRotate] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchHandleLayer(searchTerm)
    console.log("Buscando...", searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div id='left' className='sidebar flex-center left collapsed'>
      <div className='sidebar-guion flex-center'>
        <div
          className={`sidebar-toggle rounded-rect left ${rotate ? 'rotate' : ''}`}
          onClick={() => {
            window.toggleSidebar('left')
            setRotate(!rotate)
          }}
        >
          <Tooltip arrow title={`${rotate ? 'Cerrar' : 'Abrir'} sidebar`}>
            <IconButton aria-label='sidebar'>
              <ArrowForwardIcon color='info' />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div
        className='sidebar-content rounded-rect'
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper
          elevation={0}
          style={{ width: '90%', height: '80%', position: 'relative' }}
          sx={{ padding: 1 }}
        >
          {/* Bloque de búsqueda */}
          <Box
            component="form"
            sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              id="search-input"
              label="Busca id_operacion"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm && (
                      <IconButton
                        aria-label="Limpiar búsqueda"
                        onClick={handleClear}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="primary"
            >
              <SearchIcon />
            </Button>
          </Box>

          <fieldset className='select-fieldset selectFieldsetStyle'>
            <Box sx={{ minWidth: 100 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checked}
                      onChange={layerBaseHandleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label='Satelite/Calles'
                />
              </FormGroup>
              <Divider />
              <FormGroup>
                <FormControlLabel
                  name='cca_unidadconstruccion'
                  control={<Checkbox defaultChecked />}
                  label='U Construcción'
                  onChange={(event, _checked) => layerHandleChange(event as React.ChangeEvent<HTMLInputElement>)}
                />
                <FormControlLabel
                  name='cca_terreno'
                  control={<Checkbox defaultChecked />}
                  label='Terreno'
                  onChange={(event, _checked) => layerHandleChange(event as React.ChangeEvent<HTMLInputElement>)}
                />
                <FormControlLabel
                  name='cca_terreno_center'
                  control={<Checkbox defaultChecked />}
                  label='Terreno Etiquetas'
                  onChange={(event, _checked) => layerHandleChange(event as React.ChangeEvent<HTMLInputElement>)}
                />
                <FormControlLabel
                  name='cca_ortofoto_cog'
                  control={<Checkbox defaultChecked />}
                  label='Ortofoto'
                  onChange={(event, _checked) => layerHandleChange(event as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormGroup>
            </Box>
          </fieldset>
        </Paper>
      </div>
    </div>
  )
}

export default Sidebar
