const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5003;

app.use(express.json());

let events = [];

app.post('/events', (req, res) => {
    const { category, date, description, time, reminder } = req.body;
    if (!category || !date || !description || !time) {
        return res.status(400).send('Category, date, description, aur time ki zaroorat hai');
    }
    const newEventId = events.length + 1;
    const newEvent = {
        eventId: newEventId,
        category,
        date,
        description,
        time,
        reminder,
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
});

app.get('/events/:eventId', (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const event = events.find(e => e.eventId === eventId);
    if (!event) {
        return res.status(404).send('Nahi mila event');
    }
    res.json(event);
});

app.get('/events', (req, res) => {
    const { sortBy } = req.query;

    let sortedEvents = [...events];

    if (sortBy === 'date') {
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'category') {
        sortedEvents.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'reminderStatus') {
        sortedEvents.sort((a, b) => a.reminderStatus - b.reminderStatus);
    }

    res.json(sortedEvents);
});

app.listen(PORT, () => {
    console.log(`Event service chal rahi on http://localhost:${PORT}`);
});


setInterval(() => {
    const now = new Date();
    events.forEach(event => {
        if (event.reminder) {
            const eventDate = new Date(event.date + ' ' + event.time);
            const reminderDate = new Date(eventDate.getTime() - event.reminder * 60000); 
            if (now >= reminderDate && now < eventDate) {
                console.log(`Reminder: ${event.description} is starting soon!`);
            }
        }
    });
}, 60000);