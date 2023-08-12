import JinaAI from 'jinaai';

const jinaai = new JinaAI({ secrets: {
  'jinachat-secret': process.env.JINA_API_KEY
}});


export default async function (req, res) {
  if (!process.env.JINA_API_KEY) {
    res.status(500).json({
      error: {
        message: "Jina API Key is not configured",
      }
    });
    return;
  }
 
  const animal = req.body.amit || '';

  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter your query",
      }
    });
    return;
  }

  try {
    //console.log(animal)
    const output = await jinaai.generate(
      generatePrompt(animal)
    );
    res.status(200).json({ result: output.output });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with Jina Chat API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal = animal.slice(1).toLowerCase();
  return capitalizedAnimal
}
