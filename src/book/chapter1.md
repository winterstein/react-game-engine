
# Diary of a School ~~Astronaut~~ Detective

Narrator: It is hard to believe how fast things changed. How quickly my normal life gave way, like a paper house in the rain.

Narrator: And paper is what I have now to recall that journey. My diary, which records both the normal and the extraordinary.

## Sunday, September 1st

### Leaving

Mom: (v happy) Today's the day! Fresh country air here we come!

Today is the *worst* day ever. We are leaving home, and my school, and all my friends...      
and in fact we're leaving everything, to go live in Kilfearn, which is a field in the middle of nowhere.

The first challenge is packing. We did not realise how much stuff we had until we tried to pack it up. 

![](/img/src/scene/tons-of-junk.jpg)

Mom tried to use the move as an excuse to get us to throw out some of our toys. But we swore to defend them. Then Dad tried to get Mom to throw out some of her clothes. 

Dad: You can't even fit into half of them. 

The resulting explosion was heard three blocks away. 

(diagram)

So in the end we compromised by putting most of our things in storage to be delivered once we're settled in. 

Mom: Okay, pick what toy you want to have in the car.

|Dinosaur teddy|Rubik's cube|Baby doll| >> inventory

#### {if |Dinosaur teddy|}
The dinosaur teddy is fierce but cuddly. I feel my courage increase. {player.courage += 1}

#### {if |Rubik's cube|}
Playing with the Rubik's cube will focus my mind. {player.knowledge += 1}

#### {if |Baby doll|}
Care is something you can practice, just like sports. Playing with the baby doll practices caring for others. {player.understanding += 1}


### Packing

A van and two surly men came round. They threw all our stuff in their van, like it was just so much junk. 

![](/img/src/scene/load-truck.jpg)

They handed Dad a ticket and drove off.

Mom: Don't lose that. 

### Driving

And then, without further ado, we are off. There really should have been more ado: A speech by the mayor; weeeping friends... 

But it's just the click of seatbelts, the clunk of car doors, and the rumble of the engine. 

//(drive, city, field, cows skull, field)

> It's a long drive. How will I pass the time?

|Talk to my sister Cassie|Read a book|

#### {if |Talk to my sister Cassie|}

Cassie: So I know we didn't talk much at the old school, what with me being a senior.

Cassie: But this is a new start. At the school in Kilfearn...

Cassie: ...I'm not going to talk to you *at all*. 

Cassie: I don't want to see you. Or hear you. I am a lioness and you are a toad. Don't get in my way.

My sister Cassie is all heart. Not.

{player.connection.cassie += 1}

#### {if |Read a book|}

I read some of my book. 

Book: The human race, to which so many of my readers belong, has been playing at children's games from the beginning, and will probably do it till the end...

//Mr. and Mrs. Dursley of number 4, Privet Drive, were proud to say that they were perfectly normal, thank you very much.
//The human race, to which so many of my readers belong, has been playing at children's games from the beginning, and will probably do it till the end...
// Many years later, as he face the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.

{player.knowledge += 1}

#### {end:if}

After a while, I drifted off to sleep. I had the weirdest dream.

### Dream

I'm in a garden. It's a nice garden. There are flowers and butterflies of every colour. I'm seated in a chair facing two most peculiar people. One is a friendly looking old man who smiles at me. The other is a girl with long dark hair, who looks off to the side, as if the whole garden is just *too* boring. 

The first person is - is now a middle aged Indian lady still smiling. And then he, she, they are a young dark skinned boy, then a Chinese girl and, and... I never see them do it, but they keep changing. However, their smile remains the same, and I somehow know it's all one person.

(garden)

Omega "Morphing Person": Welcome to The Garden. Do not be worried. This is a safe place.

Omega "Morphing Person": I am omega, or 𝜔 for short. I have summoned you here for a purpose. You are a Wayfarer and it is time for your skills to awaken.

Omega: There is something going on in Kilfearn. 

Dardariel "Moody Girl": Can I go yet? There's no point explaining anything to him before he's had a first crossing.

She makes a gesture, and the garden fades out.

### Driving

<img src='/img/src/car.png' />

The dream ends, and I wake up in the car.

Cassie: You drool in your sleep. It's disgusting.

We arrive. I had hoped the new home might be something special. To make up for it being out in the boondocks, it should be a mansion, 
with a pool, a games room, a TV room, and a trampoline. 

This is... not the case. My hopes are dashed, and then the pieces of hope are trodden on.

### Arrive

Our new house is a dump. The paint is peeling. There is a smell of damp. But I do not discover the true horror of the situation until a few minutes later.

## {explore:home}

#### {spider}

Spider: This is my bathroom.

James: OK, I see that. I'll leave you alone now.

#### {dad}

Dad: Let's get unpacked. Starting with a bottle of something.

#### {mom}

Mom: Isn't it... Er, well... We can do a lot to improve it!

|"Like what?"|"Like demolish it with a bulldozer?"|

Mom: Maybe a coat of paint.

#### {cassie}

Cassie: Listen RatFace, you-touch-my-music-you-die. (She says this without looking up from her phone.)

{end:explore:home}

## About Cassie

There are only two bedrooms.    
So I have to share with my sister.    

Aargh.    
Aaaaaaargh.   

Meet my sister.

Cassie: (face) Name: Cassie<br/>Age:	16<br/>Likes:	BoyZone, Billy Thompson in class S5, selfies<br/>Dislikes:	Younger brothers<br/>Warning:	Highly dangerous

## End of Chapter 1

{story:chapter2}
