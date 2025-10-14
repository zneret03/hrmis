export async function POST() {
  const sfdt = [{ text: 'value1' }, { text: 'value2' }]
  return new Response(JSON.stringify(sfdt), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
