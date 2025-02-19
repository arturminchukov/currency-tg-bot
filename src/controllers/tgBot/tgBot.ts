import * as http from "node:http";
import axios from "axios";
import EventEmitter from 'node:events'

const DEFAULT_POLL_INTERVAL = 500;
const HOST = 'https://api.telegram.org';

interface Options {
    apiKey: string;
    pollInterval: number;
}

export interface TgUser {
    "id": number,
    "is_bot": boolean,
    "first_name": string,
    "last_name": string,
    "username": string,
    "language_code": string
}

export interface TgChat {
    "id": number,
    "first_name": string,
    "last_name": string,
    "username": string,
    "type": string
}

export interface CommandEntity {
    "offset": number,
    "length": number,
    "type": "bot_command"
}

interface MessageBase {
    "message_id": number,
    "from": TgUser,
    "chat": TgChat,
    "date": number,
    "text": string,
}

export interface CommandMessage extends MessageBase {
    "entities": [CommandEntity]
}

export interface TextMessage extends MessageBase {
}

export type Message = TextMessage | CommandMessage;

export type SendMessage = (message: { text: string, chat_id: number }) => void;

interface ApiResponse {
    ok: boolean,
    result: {
        update_id: number,
        message: Message
    }[]
}

class TgBot {
    private lastMessageUpdatedId: number;
    private apiKey: string;
    private pollInterval: number;
    private botUrl: string;
    private messageEmitter: EventEmitter;

    constructor({apiKey, pollInterval}: Options) {
        this.lastMessageUpdatedId = 0;
        this.apiKey = apiKey;
        this.pollInterval = pollInterval ?? DEFAULT_POLL_INTERVAL;
        this.botUrl = `${HOST}/bot${this.apiKey}`;
        this.messageEmitter = new EventEmitter();
    }

    public start() {
        console.log("Starting TgtBot");
        setInterval(async () => {
            try {
                const response = await axios.get<ApiResponse>(`${this.botUrl}/getUpdates?offset=${this.lastMessageUpdatedId + 1}`);
                const messages = response.data.result;
                messages.forEach(messageData => {
                    if (this.isCommandMessage(messageData.message)) {
                        this.messageEmitter.emit(messageData.message.text, messageData.message, this.sendMessage.bind(this));
                    } else {
                        this.messageEmitter.emit('', messageData.message);
                    }
                })
                this.lastMessageUpdatedId = messages[messages.length - 1].update_id;
            } catch (e) {
                console.error(e);
            }
        }, this.pollInterval);
    }

    private sendMessage:SendMessage = async (message)=> {
        try {
            await axios.post(`${this.botUrl}/sendMessage`, message)
        } catch (e) {
            console.error(e);
        }
    }

    private isCommandMessage(message: Message): message is CommandMessage {
        return 'entities' in message;
    }


    public onMessage(message: string, handler: (req: TextMessage, sendMessage: SendMessage) => void) {
        this.messageEmitter.on(message, handler);
    }
}