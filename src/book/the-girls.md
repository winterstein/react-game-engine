
# Eilidh Mina Katie

You overhear them talking.

Girls: Oh M, you've got an apple. Swap for my crisps?

Girls: Sorry K - I prefer apples too. Try E.

Girls: Hey Red want to swap snacks? I've got crisps.

Girls: OK Blonde - I've got an orange.

Girls: It's a deal!

Katie "Blonde girl": You're the new student? Hello, I'm Katie.

Eilidh "Redhead": Oh don't tell him our names - let's see if he can guess!

|You're M and she's E|You're E and she's M|

### {if |You're M and she's E|}

Eilidh "M": Other way round. And it's Eilidh to everyone but these two.

### {if |You're E and she's M|}

Eilidh "E": Yes, that's right! But it's Eilidh to everyone but these two. {eilidh.relationship.points + 1}

### 

Mina "M": And "M" stands for "Mina". Welcome to Kilfearn High! Have an apple. {apple >> inventory}

Katie: Hey, I asked for that.


## {if flag.eilidhLost}

They go quiet when you approach.

|smile apologetically and leave|


