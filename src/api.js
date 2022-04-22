// src/api.js
// fragments microservice API
const apiUrl = process.env.API_URL;
const contentType = require('content-type');

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postData(user,data,contentType) {
  const response = await fetch(`${apiUrl}/v1/fragments`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${user.idToken}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  console.log('Response to Post', { data1 });
  document.getElementById("res").innerHTML += '<p>'  +    `Please note the Id ------->` + '<b>' + `${data1.fragment.id}`  + '</b>' + `<---------  `+ '</p>';

}

//GET /:id
export async function getData(user,id) {
  const response = await fetch(`${apiUrl}/v1/fragments/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const { type } = contentType.parse(response.headers.get('content-type'));
  if(type.includes('image')){
        document.getElementById("frag").innerHTML += `<img src=data:${type};base64,` +`${await response.text()}`+`>` ;
  }

  else{
    const data1 = await response.text();
    document.getElementById("frag").innerHTML += '<p>'  +    `Please note ------->` + '<b>' + `${data1}`  + '</b>' + `<---------  `+ '</p>';
  }
}

export async function getMetaData(user,id) {
  const response = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.text();
  console.log('Response to GET MetaData', ` ${data1} `);
  
 document.getElementById("metafrag").innerHTML += '<p>'  +    `Please note ------->` + '<b>' + `${data1}`  + '</b>' + `<---------  `+ '</p>';
 return data1;
}


export async function updateData(user,data,contentType,url) {
  const response = await fetch(`${apiUrl}/v1/fragments/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${user.idToken}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  console.log('Response to Post', { data1 });
}


export async function deleteData(user, urlID) {
  const response = await fetch(`${apiUrl}/v1/fragments/${urlID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  console.log('Response to Post', { data1 });
}


export async function getUserFragmentsList(user) {
  console.log('Requesting user fragments list...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.text(); 
    console.log('Got user\'s existing fragments metadata',data);
    document.getElementById("demo").innerHTML += '<p>'  +    `${data}` + '</p>'  ;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment?expand=1', { err });
  }
}

