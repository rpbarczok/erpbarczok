import { expect } from "expect"
import { Heading } from "../components/headings/Heading.js"
import { render, screen } from "@testing-library/react"

describe('Heading Component Test', (): void => {
    it('displays the heading', async (): Promise<void> => {
        render(<Heading title="Test" cssClass="test" />)
        expect(screen.getByText('Test')).not.toBeNull()
    })
})
