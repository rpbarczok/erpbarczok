import { useEffect, useState } from "react"
import { Button, Container } from "react-bootstrap"

export const LoginError = ({ message }: { message: string }) => {
    const [seconds, setSeconds] = useState(30)

    useEffect(() => {
        if (seconds < 0) {
            return
        }

        const timer = setInterval(() => { setSeconds((prevSeconds) => prevSeconds - 1) }, 1000)
        return () => clearInterval(timer)
    }, [seconds])

    const retry = () => {
        window.location.reload()
        setSeconds(30)
    }

    if (seconds < 0) {
        retry()
    }
    
    return <Container fluid className="d-flex flex-column vh-100 align-items-center justify-content-center">
        <h3>Fehler: {message}</h3>
        <h4>Bitte beachten Sie, dass es in der Demo-Version bis zu 30 Sekunden dauern kann, bis die App startet</h4>
        <h4>Automatischer erneuter Versuch in {seconds} Sekunden</h4>
        <Button size="lg" onClick={retry}>Erneuter Versuch</Button>
    </Container>
}