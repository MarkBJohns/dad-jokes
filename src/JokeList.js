import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const getJokes = async () => {
        try {
            let jokes = [];
            let seenJokes = new Set();
            
            while (jokes.length < numJokesToGet) {
                let result = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                let { ...joke } = result.data;
                
                if (!seenJokes.has(joke.id)) {
                    seenJokes.add(joke.id);
                    jokes.push({ ...joke, votes: 0 });
                } else {
                    console.log("duplicate found");
                }
            }
            
            setJokes(jokes);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    }
    
    const generateNewJokes = () => {
        setIsLoading(true);
        getJokes();
    }
    
    const vote = (id, delta) => {
        setJokes(jokes.map(j => 
            j.id === id ? { ...j, votes: j.votes + delta } : j
        ));
    }
    
    useEffect(() => {
        getJokes();
    }, []);
    
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    
    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        )
    }
    
    return (
        <div className="JokeList">
            <button
                className="JokeList-getmore"
                onClick={generateNewJokes}
            >
            Get New Jokes
            </button>
            
            {sortedJokes.map(j => (
                <Joke
                    text={j.joke}
                    key={j.key}
                    id={j.id}
                    votes={j.votes}
                    vote={vote}
                />
            ))}
        </div>
    )
}

export default JokeList;