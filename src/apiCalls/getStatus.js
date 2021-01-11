const HOST = process.env.REACT_APP_HOSTNAME;

const getStatus = async (body) => {
  try {
    const res = await fetch(`http://test.alistetechnologies.com:3000/devices`, {
      method: "POST",
      body,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return await res.json()
  } catch (e) {
    console.log(e)
  }
}

export default getStatus