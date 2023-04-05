import { render, screen } from '@testing-library/react'
import App from '../pages'
import { act } from 'react-dom/test-utils'

jest.mock('next/router', () => require('next-router-mock'))

describe("App", () => {
  it("should render correctly App", async () => {
    await act( async () => render(<App/>))
  })
})