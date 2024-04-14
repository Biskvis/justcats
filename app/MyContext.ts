import { createContext } from 'react';
import { DocumentData } from 'firebase/firestore';

export const MyContext = createContext<DocumentData>({} as DocumentData);
