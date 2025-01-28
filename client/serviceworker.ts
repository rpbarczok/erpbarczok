export default function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/serviceworker.js')
            .then(registration => {
                console.log('SW registeres: ', registration)
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError)
            })
        })
    }
}