sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Write note and click Save button
    activate browser
    Note right of browser: The browser executes JavaScript to send the new note

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: The server saves the new note to the database
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: The browser updates the notes list dynamically without a page reload
    deactivate browser
