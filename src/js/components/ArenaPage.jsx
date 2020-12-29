/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import { Button, Card, CardTitle } from 'reactstrap';
import DataStore from '../base/plumbing/DataStore';
import { modifyHash } from '../base/utils/miscutils';
import { CHARACTERS } from '../Character';


let round = 1;


/**
 * Each fight is worth about 2x the previous
 * Random monsters
 * which level up and increase in number
 * How far do you dare go?
 * 
 * 
 */
const ArenaPage = () => {
	let team = DataStore.getValue('game','team') || DataStore.setValue(['game','team'], [], false);
	return (<>
		<Card>
			<h1>Pick Your Team</h1>
			{Object.values(CHARACTERS).filter(c => c.fighter).map(c => <TeamMate key={c.name} character={c} team={team} />)};
		</Card>
		<div>
			<h1>Round {round}</h1>		
			Ready? <Button disabled={ ! team.length} size='lg' color='danger' onClick={e => startFight(team)}>Go!</Button>
		</div>
	</>);
};

const TeamMate = ({character, team}) => {
	// {JSON.stringify(getRelationship(character.name))}
	// {JSON.stringify(character)}
	return (<Card color={team.includes(character.id)? 'primary' : 'secondary'}><CardTitle>ID: {character.id} - name: {character.name}</CardTitle>
		<img src={character.src} height='100px' />
		{team.includes(character.id)? 
			<Button onClick={ e => DataStore.setValue(['game','team'], team.filter(t => t !== character.id)) }>Remove</Button>
			: <Button onClick={ e => team.push(character.id) && DataStore.update() } disabled={team.length >= 4}>Add</Button>}
	</Card>);
};

const startFight = team => {
	modifyHash(['fight'], {lhs:team.join(",")});
};

export default ArenaPage;
