import { Container } from "react-bootstrap"


export const ErrorCatcher = ({error}: {error: unknown}) => {

    if (error instanceof Error) {
        return (<Container fluid className='d-flex flex-column vh-100 align-items-center justify-content-center'>
            <h4>Fehler</h4>
            <h5>{error.message}</h5>
        </Container>
        )
    } else {
        return (<Container fluid className='d-flex flex-column vh-100 align-items-center justify-content-center'>
            <h4>Fehler</h4>
            <h5>{String(error)}</h5>
        </Container>
        )
    }

}