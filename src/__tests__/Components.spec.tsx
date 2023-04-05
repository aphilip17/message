import { render, screen, fireEvent } from '@testing-library/react'
import { waitForElementToBeRemoved} from '@testing-library/dom'
import { setupServer } from 'msw/node';
import { rest } from 'msw'
import { act } from 'react-dom/test-utils'
import { SWRConfig } from 'swr'

import { UserSelect } from "../components/UserSelect"
import { ConversationsList } from "../components/ConversationsList"
import { MessagesFlow } from '../components/MessagesFlow';

jest.mock('next/router', () => require('next-router-mock'))


const posts = [
{
    "id": 1,
    "nickname": "Thibaut",
    "token": "xxxx"
}, {
    "id": 2,
    "nickname": "Jeremie",
    "token": "xxxx"
}, {
    "id": 3,
    "nickname": "Patrick",
    "token": "xxxx"
}, {
    "id": 4,
    "nickname": "Elodie",
    "token": "xxxx"
}];

const server = setupServer()


beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Users page", () => {
    beforeEach(async () => {
        server.use(
            rest.get('http://localhost:3005/users',
            (_req, res, ctx) => {
                return res(
                ctx.delay(100),
                ctx.status(200),
                ctx.json(posts)
            )
        }))

        await act( async () => {render(
            /* To avoid cache */
            <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map()}}>
                <UserSelect/>
            </SWRConfig>
        )})

        await waitForElementToBeRemoved(() => screen.getAllByText('Loading...'))
    })

    it("should render the expected users", async () => {
        expect(await screen.findByText('Choose a user')).toBeInTheDocument()
        expect(await screen.findByText('Thibaut')).toBeInTheDocument()
        expect(await screen.findByText('Jeremie')).toBeInTheDocument()
        expect(await screen.findByText('Patrick')).toBeInTheDocument()
        expect(await screen.findByText('Elodie')).toBeInTheDocument()
        expect(screen.getAllByRole('option').length).toBe(5)
    })
})


const conversations = [
    {
      "id": 1,
      "recipientId": 2,
      "recipientNickname": "Jeremie",
      "senderId": 1,
      "senderNickname": "Thibaut",
      "lastMessageTimestamp": 1625637849
    },
    {
      "id": 2,
      "recipientId": 3,
      "recipientNickname": "Patrick",
      "senderId": 1,
      "senderNickname": "Thibaut",
      "lastMessageTimestamp": 1620284667
    },
    {
      "id": 3,
      "recipientId": 1,
      "recipientNickname": "Thibaut",
      "senderId": 4,
      "senderNickname": "Elodie",
      "lastMessageTimestamp": 1625648667
    }
]

describe("Conversations List", () => {
    it("should render the expected conversations", async () => {
        const mockClick = jest.fn()
        await act( async () => render(<ConversationsList
            conversations={conversations}
            userId={1}
            handleSelect={mockClick}
        />))

        const jeremie = screen.getByText('Jeremie')
        expect(jeremie).toBeInTheDocument()
        const patrick = screen.getByText('Patrick')
        expect(patrick).toBeInTheDocument()
        const elodie = screen.getByText('Elodie')
        expect(elodie).toBeInTheDocument()

        fireEvent.click(jeremie)
        expect(mockClick.mock.calls.length).toBe(1);
    })
})


const messages = [ {
    "id": 1,
    "conversationId": 1,
    "timestamp": 1625637849,
    "authorId": 1,
    "body": "Bonjour c'est le premier message de la première conversation"
  },
  {
    "id": 2,
    "conversationId": 1,
    "timestamp": 1625637867,
    "authorId": 1,
    "body": "Bonjour c'est le second message de la première conversation"
  },
  {
    "id": 3,
    "conversationId": 1,
    "timestamp": 1625648667,
    "authorId": 2,
    "body": "Bonjour c'est le troisième message de la première conversation"
}]

describe("Messages", () => {
    beforeEach(async () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn()
        server.use(
            rest.get('http://localhost:3005/messages/1',
            (_req, res, ctx) => {
                return res(
                ctx.delay(100),
                ctx.status(200),
                ctx.json(messages)
            )
        }))

        await act( async () => render(
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map()}}>
            <MessagesFlow
                conversationId={1}
                userId={1}
                friendName={'Jeremie'}
                handleBackClickForMobile={() => {}}
            />
        </SWRConfig>
        ))

        await waitForElementToBeRemoved(() => screen.getAllByText('Loading...'))
    })

    it("should render the expected messages", async () => {
        const mockClick = jest.fn()

        expect(await screen.findByText('Bonjour c\'est le premier message de la première conversation'))
            .toBeInTheDocument()
        expect(await screen.findByText('Bonjour c\'est le second message de la première conversation'))
            .toBeInTheDocument()
        expect(await screen.findByText('Bonjour c\'est le troisième message de la première conversation'))
            .toBeInTheDocument()
    })

    test('should allow enter message in textarea', () => {
        const textarea = screen.getByPlaceholderText('Enter a message')
        fireEvent.change(textarea, {target: {value: 'Nouveau message'}})
        expect((textarea as HTMLInputElement).value).toBe('Nouveau message')
    })

    test('should allow click on submit button', () => {
        const button = screen.getByText('Submit')
        fireEvent.click(button)
        expect(button).toBeDisabled()
    })
})