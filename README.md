# cypher-note

[Cypher Note](https://cypher-note.vercel.app/) is a desktop/web application built with Electron, specifically designed for obfuscated prompting with Language Learning Models (LLMs). It facilitates a secure interaction layer between users and LLMs by enabling the encryption of sensitive text within prompts. This ensures that extra context is not inadvertently passed on to the LLM, safeguarding user privacy. Additionally, Cypher Note provides the functionality to decrypt responses received from the LLM, allowing for a seamless, secure dialogue flow.
It is available online here: https://cypher-note.vercel.app/ 

# Table of Contents
- [cypher-note](#cypher-note)
- [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Considerations](#considerations)
  - [License](#license)

## Features

- **Sensitive Text Encryption & Decryption**: Securely encrypt sensitive text within prompts before sending to an LLM, and decrypt LLM responses to view original context.
- **Session Management**: Manage encryption sessions with start and end capabilities, ensuring that encryption keys (noun mappings) are only active when needed.
- **Custom Text Marking**: Easily mark text for encryption with mouse or keyboard shortcuts, visually highlighting text segments for encryption or decryption.
- **Word options**: Case-sensitive and whole word options can be used to perform mappings on words that match by case and/or by the entire word too.
- **It's all on you**: The mappings take place completely on your browser. It is also possible to run a self-hosted version as shown [below](#getting-started).

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository to your local machine:
```bash
git clone https://github.com/your-github-username/cypher-note.git
```

2. Navigate to the cloned repository directory:
```bash
Copy code
cd cypher-note
```

3. Install the necessary dependencies:
```
npm install
```

4. Launch the application:
```
npm start
```

## Usage

- **Encrypting Text**: Highlight the text you wish to encrypt within your prompt and use the left-and-right mouse buttons *or* Ctrl-Space keyboard shortcut to mark a sensitive word. When you're done, you can click the "Encrypt" button to perform the mapping in place that can be safely sent to the LLM.
- **Decrypting LLM Responses**: After receiving a response containing muddled words, use the "Decrypt" button to convert it back into its original form, maintaining the confidentiality of sensitive information.
- **Session Control**: Use the "End Session" button to clear all current encryption mappings and start a new session, ensuring old mappings are not retained.
- **Accessing Help**: Click the "Help" button to view detailed instructions on using Cypher Note effectively.

## Contributing

We welcome contributions! Feel free to submit pull requests or create issues for bugs, features, or improvements.

## Considerations

- [ ] Direct LLM integration? (Avoid the whole copy-paste workflow)

## License

Cypher Note is made available under the MIT License. See the LICENSE file for more details.

