import * as fs from 'fs';

let rawData = fs.readFileSync('result.json', 'utf-8');

if (!rawData.trim().startsWith('[')) {
  rawData = `[${rawData}]`;
}
interface TextEntity {
  type: string;
  text: string;
}
interface Message {
  id: number;
  type: string;
  date: string;
  date_unixtime: string;
  from: string;
  from_id: string;
  text: string | string[];
  text_entities: TextEntity[];
  edited?: string;
  edited_unixtime?: string;
  reactions?: any[];
  photo?: string;
  width?: number;
  height?: number;
}
interface Chat {
  name: string;
  type: string;
  id: number;
  messages: Message[];
}

const data: Chat[] = JSON.parse(rawData);
const wordCounts: { [key: string]: { name: string, count: number } } = {};
const countWords = (text: string): number => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

data.forEach((chat: Chat) => {
  chat.messages.forEach((message: Message) => {
    const userId = message.from_id;
    const userName = message.from;
    const text = message.text;
    const messageText = Array.isArray(text) ? text.join(' ') : text;
    const wordCount = countWords(messageText);

    if (!userId || !userName || !text) {
      return;
    }
    
    if (wordCounts[userId]) {
      wordCounts[userId].count += wordCount;
    } else {
      wordCounts[userId] = { name: userName, count: wordCount };
    }
  });
});

for (const userId in wordCounts) {
  console.log(`${wordCounts[userId].name}: ${wordCounts[userId].count} words`);
}