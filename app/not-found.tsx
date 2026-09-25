import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · WRONG STOP</span><h1>This route isn’t serving.</h1><Link className="button button-red" href="/">Back to College Boy</Link></main>;
}
