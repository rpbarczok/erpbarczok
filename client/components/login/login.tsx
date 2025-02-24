import { Button, Container, Image, Row, Col } from "react-bootstrap"
import { useAuth } from 'react-oidc-context'
import './login.css'
import '../../style.css'
import panda from './panda_dangerous.png'


export const Login = () => {
    const auth = useAuth()

    const signInHandler = () => {
        auth.signinRedirect()
    }

    return (
        <div>
            <Row className="text-center">
                <h1 >Panda 2</h1>
                <h3 >Bitte loggen Sie sich ein!</h3>
            </Row>
            <Row>
                <Col xxs={1} sm={2} md={3} lg={4}>
                </Col>
                <Col className="text-center">
                    <Image className="img-fluid" src={panda} alt="Können Sie sich ausweisen?" aria-description="Grumpy looking Giant Panda, who wants your credentials!" />
                    <Button className="login-button" size="lg" variant="outline-primary" onClick={signInHandler} > Login </Button>
                </Col>
                <Col xxs={1} sm={2}  md={3} lg={4}>
                </Col>
            </Row>
        </div>
    )
}