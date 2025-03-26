import { Button, Container, Image, Row, Col } from 'react-bootstrap'
import { useAuth } from 'react-oidc-context'

export const Login = () => {
    const auth = useAuth()

    const signInHandler = () => {
        auth.signinRedirect()
    }

    return (
        <>
            <Row className='text-center'>
                <h1 >ERPBarczok</h1>
                <h3 >Bitte loggen Sie sich ein!</h3>
            </Row>
            <Row>
                <Col xxs={1} sm={2} md={3} lg={4}>
                </Col>
                <Col className='text-center'>
                    <Button className='login-button' size='lg' variant='outline-primary' onClick={signInHandler} > Login </Button>
                </Col>
                <Col xxs={1} sm={2} md={3} lg={4}>
                </Col>
            </Row>
        </>
    )
}