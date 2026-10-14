import { Box, Container, Paper, } from '@mui/material'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <Box>
        <Container>
            <Paper>
                
                <Outlet/>

            </Paper>
        </Container>
    </Box>
  )
}

export default AuthLayout