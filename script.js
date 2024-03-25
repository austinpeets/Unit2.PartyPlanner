// A user enters the website and finds
// a list of the names, dates, times, locations, and descriptions 
// of all the parties that are happening.
// Next to each party in the list is a delete button.
// The user clicks the delete button for one of the parties.
// That party is then removed from the list.
// There is also a form that allows the user to enter information
// about a new party that they want to schedule.
// After filling out the form and submitting it,
// the user observes their party added to the list of parties.



// API to use
const APIURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-MT-WEB-PT/events'



async function fetchPartyList() {
    const response = await fetch(`${APIURL}`);
    const data = await response.json();
    console.log(data)
    return data
}

async function displayPartyList() {
    const response = await fetchPartyList();
    const parties = response.data;
    const partyListElement = document.getElementById('party-list')

    partyListElement.innerHTML = '';

    parties.forEach(party => {
        const partyElement = document.createElement('li');
        partyElement.textContent = `${party.name} - ${party.date} - ${party.location} - ${party.description}`
    

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
        await deleteParty(party.id);
        await displayPartyList()
    });

    partyElement.appendChild(deleteButton);
    partyListElement.appendChild(partyElement)
    });
} 

async function deleteParty(id) {
   try {
    const response =  await fetch(`${APIURL}/${id}`, {
        method: 'DELETE' ,
    });
    if (!response.ok) {
        throw new Error('Failed to delete party')
    }

} catch (error){
    console.error('Error deleting party: ', error.message)
}
}

document.getElementById('party-form').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dateInput = formData.get('datetime');
    const isoDate = new Date(dateInput).toISOString();
    const partyData = {
        name: formData.get('name'),
        description: formData.get('description'),
        date: isoDate,
        location: formData.get('location')
    };
    await addParty(partyData);
    await displayPartyList();
});

async function addParty(partyData) {
    try {

        const response = await fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    
        },
        body: JSON.stringify(partyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add party');
    }

} catch (error) {
    console.error('Error adding party: ', error.message);
    }

}
window.addEventListener('load', displayPartyList);