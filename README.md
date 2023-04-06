# Architecture :

First I use the home page to display the list of users. That's allow to
simulate an authentification with one user. It would be better to have a real authentication page.

One a user is choosen we are redirect on a new page: the "messages" page which contains the main
component: "Messages".
"Messages" contains two components: "ConversationsList" and "MessagesFlow" components.
It takes care of passing data between components.

# UI :

I choose a very simple UI like in others app chat: list of conversations on the left and messages on the right.

When page is resized and its width become inferior to 768px the layout of the app changes. This way it is easier to use it on small devices.

# Data storage :

I used localStorage to store states. (for example if page is reloaded)

# Error and loader :

I handle server errors: errors are displayed in the page in a "card" to inform users.
I add a spinner if data take time to query.

# Accessibility :

I tried to make the app as accessible as possible. It is possible to do everything with the keyboard. Text color and background are choosen to be easily read.

# Performances :

I tried to be carreful to not re-render components when it is not nessassary.

# Test Jest:

I added some tests to test each components.