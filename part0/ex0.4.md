sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Write note and click Save button
    activate browser
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: The server saves the new note to the database
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: The browser fetches the updated notes list

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: Updated notes list in JSON format
    deactivate server

    Note right of browser: The browser updates the notes list on the page
    deactivate browser
