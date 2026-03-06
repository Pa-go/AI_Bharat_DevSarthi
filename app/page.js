// app/page.js
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically sends users to the English version
  redirect('/en');
}