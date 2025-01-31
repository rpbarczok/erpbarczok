export default function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registeres: ', registration)
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError)
            })
        })
    }
}