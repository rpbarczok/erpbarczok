import { Button, Container, Image, Row, Col } from "react-bootstrap"
import { useAuth } from 'react-oidc-context'
import './login.css'
import '../../style.css'


export const Login = () => {
    const auth = useAuth()

    return (
        <Container className="login-page">
            <Row>
                <h1 >Panda 2</h1>
                <h3 >Bitte loggen Sie sich ein!</h3>
            </Row>
            <Row>
                <Image src='../../public/panda_dangerous.jpg' alt="Können Sie sich ausweisen?" aria-description="Grumpy looking Giant Panda, who wants your credentials!" />
            </Row>
            <Row>
                <Button size="lg" variant="outline-primary" onClick={() => void auth.signinRedirect()} > Login </Button>
            </Row>
        </Container>
    )
}