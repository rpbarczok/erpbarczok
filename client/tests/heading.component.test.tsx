import { expect } from "expect"
import { Heading } from "../components/headings/Heading.js"
import { render, screen } from "@testing-library/react"

describe('Heading Component Test', function() {
    it('displays the heading', function()  {
        render(<Heading title="Test" cssClass="test" />)
        expect(screen.getByText('Test')).not.toBeNull()
    })
})
