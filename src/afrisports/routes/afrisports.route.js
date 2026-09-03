import express from "express";
import {
  getFixtures,
  getLeagueFixtures,
  getLiveMatches,
  getMatchEvents,
  getLineups,
  getStandings,
  getTopScorers,
  getTeams
} from "../services/FootballMatchEngine.js";
import { getBigMatches } from "../services/BigMatchEngine.js";
import { getLiveFeed, getTodayFeed, getTomorrowFeed, getDiscoveryFeed, getFeaturedFeed, getAllCompetitions } from "../services/AfriSportsDiscoveryEngine.js";
import { getTrendingMatches } from "../services/TrendingMatchEngine.js";
import { getMatchPrediction } from "../services/FootballPredictionService.js";
import { getFixtureUniverse } from "../services/AfriSportsFixtureUniverseService.js";

const router = express.Router();

router.get("/competitions", async (req, res) => {
  try {
    res.json(await getAllCompetitions());
  } catch (error) {
    res.status(500).json({
      error: "AfriSports competitions failed",
      message: error.message
    });
  }
});

router.get("/fixture-universe", async (req,res)=>{
  try{
    res.json(await getFixtureUniverse());
  }catch(error){
    res.status(500).json({
      error:"AfriSports fixture universe failed",
      message:error.message
    });
  }
});

router.get("/fixtures", async (req,res)=>{
  try{
    res.json(await getFixtures(req.query.date));
  }catch(error){
    res.status(500).json({
      error:"AfriSports fixtures failed",
      message:error.message
    });
  }
});

router.get("/live", async (req,res)=>{
  try{
    res.json(await getLiveFeed());
  }catch(error){
    res.status(500).json({
      error:"AfriSports live failed",
      message:error.message
    });
  }
});

router.get("/today", async (req,res)=>{
  try{
    res.json(await getTodayFeed());
  }catch(error){
    res.status(500).json({
      error:"AfriSports today failed",
      message:error.message
    });
  }
});

router.get("/tomorrow", async (req,res)=>{
  try{
    res.json(await getTomorrowFeed());
  }catch(error){
    res.status(500).json({
      error:"AfriSports tomorrow failed",
      message:error.message
    });
  }
});
router.get("/discovery", async (req,res)=>{
  try{
    res.json(await getDiscoveryFeed());
  }catch(error){
    res.status(500).json({
      error:"AfriSports discovery failed",
      message:error.message
    });
  }
});

router.get("/featured", async (req,res)=>{
  try{
    res.json(await getFeaturedFeed());
  }catch(error){
    res.status(500).json({
      error:"AfriSports featured failed",
      message:error.message
    });
  }
});


router.get("/trending", async (req,res)=>{
  try{
    res.json(await getTrendingMatches());
  }catch(error){
    res.status(500).json({
      error:"AfriSports trending failed",
      message:error.message
    });
  }
});

router.get("/prediction/:fixture", async (req,res)=>{
  try {
    res.json(
      await getMatchPrediction(
        req.params.fixture,
        req.query.date,
        req.query
      )
    );
  } catch(error) {
    res.status(404).json({
      error:"AfriSports prediction failed",
      message:error.message
    });
  }
});

router.get("/big-matches", async (req,res)=>{
  try{
    const data = await getBigMatches();
    res.json(data);
  }catch(error){
    res.status(500).json({
      error:"AfriSports big matches failed",
      message:error.message
    });
  }
});

router.get("/leagues/:league/fixtures", async (req,res)=>{
  try{
    res.json(await getLeagueFixtures(
      req.params.league,
      req.query.season
    ));
  }catch(error){
    res.status(500).json({
      error:"AfriSports league fixtures failed",
      message:error.message
    });
  }
});

router.get("/events/:fixture", async (req,res)=>{
  try{
    res.json(await getMatchEvents(req.params.fixture));
  }catch(error){
    res.status(500).json({
      error:"AfriSports events failed",
      message:error.message
    });
  }
});

router.get("/lineups/:fixture", async (req,res)=>{
  try{
    res.json(await getLineups(req.params.fixture));
  }catch(error){
    res.status(500).json({
      error:"AfriSports lineups failed",
      message:error.message
    });
  }
});

router.get("/standings/:league", async (req,res)=>{
  try{
    res.json(await getStandings(
      req.params.league,
      req.query.season
    ));
  }catch(error){
    res.status(500).json({
      error:"AfriSports standings failed",
      message:error.message
    });
  }
});

router.get("/topscorers/:league", async (req,res)=>{
  try{
    res.json(await getTopScorers(
      req.params.league,
      req.query.season
    ));
  }catch(error){
    res.status(500).json({
      error:"AfriSports scorers failed",
      message:error.message
    });
  }
});

router.get("/teams/:league", async (req,res)=>{
  try{
    res.json(await getTeams(
      req.params.league,
      req.query.season
    ));
  }catch(error){
    res.status(500).json({
      error:"AfriSports teams failed",
      message:error.message
    });
  }
});

export default router;
