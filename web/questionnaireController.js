import express from 'express';
import Questionnaire from '../domain/questionnaire'
import log4js from 'log4js';
import HttpStatus from 'http-status-codes';


let logger = log4js.getLogger('Controller');

// router is our dispatcher here!!!
let router = express.Router();
// export dispatcher to be able to use it outside of this module

router.get('/', (req, res) => {
  Questionnaire.find((err, questionnaires) => {
    if (err) {
      logger.error("Error: ", err);
      return res.status(400).send(err)
    }
    logger.debug(`Found ${questionnaires.length} questionnaires.`)
    res.send(questionnaires);
  });
});


router.get('/:id', (req, res) => {
    Questionnaire.findById(req.params.id, (err, question) => {
        if( err ) {
            logger.error(err);
            return res.status(400).send(err)
        }
        logger.debug("Found Question", question.id);
        res.send(question);
    })
});

router.post('/', (req, res) => {
    logger.debug("Save new question");
    const question = new Questionnaire();
    question.title = req.body.title;
    question.description = req.body.description;
    logger.debug("Question: ", question);
    // Save
    question.save(err => {
        if(err) {
            logger.error("Could not save database", err);
            return res.status(400).send(err);
        }
        logger.info("Update question");
        return res.send(question);
    });
});


router.put('/:id', (req, res) => {
    logger.debug("UPDATE Question");
    Questionnaire.findById(req.params.id, (err, question) => {
        if( err ) {
            logger.error(err);
            return res.status(400).send(err)
        }
        logger.debug("Found Question", question.id);
        question.title = req.body.title;
        question.description = req.body.description;

        // Update database
        question.save(err => {
            if(err) {
                logger.error("Could not save database", err);
                return res.status(400).send(err);
            }
            logger.info("Update question");
            return res.send(question);
        });
    });
});


router.delete('/:id', (req, res) => {
    logger.debug("Delete question with id: ", req.params.id);
    Questionnaire.findOne({_id: req.params.id}, (err, question) => {
        if( err ) {

            logger.error("Could not find question: ", err);
            return res.status(400).send(err)
        }
        logger.debug("Found Question", question.id);
        
        question.remove((err, removed) => {
            if(err) {
                logger.debug("Could not delete the question: ", err);
                return res.status(400).send(err);
            }
            res.send();
        });
    });
});

module.exports = router;
