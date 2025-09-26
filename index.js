const express = require('express');
const fs = require('fs-extra');
const axios = require('axios');
const app = express();


// === CONFIG ===
const PERPLEXITY_API_KEY = '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';
const GOOGLE_TTS_CREDENTIALS = 'path/to/credentials.json';
const TMP_DIR = './tmp';
const OUTPUT_VIDEO = 'final_video.mp4';


// 1. Input your single big story/content here
const storyContent = `Zhou Mingrui awoke in agony, his head pounding as though repeatedly struck with a pole or pierced by a sharp object twisting in his temples. Immobilized and unable to move, he found himself trapped in what felt like a dream. The familiar throbbing and confusion made him question if he was truly awake or caught in a surreal loop of slumber. His attempts to focus and escape the darkness were futile, as random, uncontrollable thoughts flooded his mind. In his delirium, Zhou Mingrui pondered over the source of his pain, suspecting something as dire as a cerebral hemorrhage. His frustration peaked as he realized sleep was impossible, and his fleeting thoughts humorously lingered on work-related woes and the prospect of taking time off. Slowly, through sheer willpower, he managed to regain some control, moving his back and opening his eyes. His blurry vision revealed a peculiar scene: a sturdy wooden desk, an opened notebook with yellowed pages, a neatly arranged stack of books, and a strange collection of items bathed in faint crimson light. The lamp beside the desk had a Western design, and the eerie glow illuminated a black ink bottle adorned with an angel pattern, a dark-colored pen, and a brass revolver. The sight of the revolver shocked him—it was utterly foreign and far removed from the familiarity of his room. As he tried to make sense of his surroundings, Zhou Mingrui noticed the crimson hue came from the light filtering through a window. When he looked up, his eyes met the chilling sight of a crimson moon hanging high against a backdrop resembling a black velvet curtain. A sense of dread overwhelmed him, and when he tried to stand, the throbbing pain in his head forced him back onto his chair. the small room with brown doors on either side, a low wooden bed against the opposite wall, and a cabinet with open doors and drawers beneath it. Beside the cabinet, a grayish-white pipe connected to a mechanical device with exposed gears. In the corner near the table were coal stoves, soup pots, and kitchen utensils. Across from the right door stood a cracked dressing mirror with a simple wooden base. As Zhou Mingrui glanced at the mirror, he saw a thin figure with black hair and brown eyes staring back at him. The reflection wasn’t familiar—it wasn’t him. Memories began to surface, revealing a new identity: Klein Moretti, a history graduate from the Loen Kingdom’s City of Tingen. Klein’s family struggled financially, supported by his elder brother, while his father had died in a colonial conflict and his mother, a devotee of the Evernight Goddess, had passed away years ago. Among Klein’s memories, his knowledge of ancient languages like Hermes stood out. Zhou Mingrui’s gaze fell on the notebook on the desk, its text shifting from alien to readable. Written in Hermes language, it ominously read, “Everyone will die, including me.” The message sent shivers down his spine. He leaned back in shock, noticing a bloody handprint on the table and realizing his palm was covered in blood. Approaching the mirror, Zhou Mingrui examined his reflection closely. His temple bore a grotesque wound with burn marks and blood-stained edges. Grayish-white brain matter squirmed within, leaving him stunned and deeply unsettled. The throbbing pain in his head persisted, amplifying the unease of his surreal predicament.`;


// 2. Use Perplexity Sonar API to split story into scenes with unique prompts
async function splitScenesWithPrompts(content) {
  const apiUrl = 'https://api.perplexity.ai/chat/completions';
  const payload = {
    model: "sonar-pro",
    messages: [{
      role: "user",
      content: 
      `
Split the following narrative into the greatest possible number of cinematic scenes by detecting changes in setting, lighting, and action.

For each scene:
- Generate a unique, clear, and concise image prompt.
- Include only essential visual elements: primary subjects, environment, mood, and lighting.
- Avoid overly long or complex descriptions.
- Use language simple enough for AI image generators (like Perplexity) to understand.
- Specify cinematic style, 16:9 aspect ratio, and 4K resolution.
- No pronouns or references to other scenes.
- The prompt should be enough to create a vivid image but not overwhelming.

Return a JSON array with objects:
{
  "scene_number": <number>,
  "scene_text": <original scene excerpt>,
  "prompt": <concise detailed image prompt>
}

Narrative:
${content}
`
//       `
// You are a cinematic storyboard artist tasked with splitting the following narrative into the greatest possible number of highly detailed, visually distinct cinematic scenes suitable for creating a richly textured video.

// Instructions:

// 1. Split the narrative into as many finely detailed short scenes as possible, capturing every change in:
//    - Location
//    - Lighting and atmosphere
//    - Action or movement
//    - Character posture, expression, or gesture
//    - Background elements or props
//    - Mood or emotional tone

// 2. For each scene, generate a unique, standalone image prompt that:
//    - Fully describes the scene with vivid, concrete, and sensory details
//    - Uses no pronouns or references connecting it to other scenes
//    - Contains safe, policy-compliant content (no violence, nudity, hate symbols, or offensive content)
//    - Emphasizes cinematic aspects: lighting, colors, texture, composition, and mood
//    - Fits within a 16:9 aspect ratio and 4K resolution format

// 3. Return your output as a JSON array of objects with each object including:
//    - "scene_number": integer sequence of the scene
//    - "scene_text": the exact text excerpt of this scene from the narrative
//    - "prompt": the unique, detailed image prompt for this scene

// Make sure the split scenes are short and very detailed to maximize video depth and visual diversity.

// Narrative text:
// ${content}
// `
    }],
   response_format: {
    type: "json_schema",
    json_schema: {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            scene_number: { type: "integer" },
            scene_text: { type: "string" },
            prompt: { type: "string" }
          },
          required: ["scene_number", "scene_text", "prompt"]
        }
      }
    }
  }

   
  };
  const response = await axios.post(apiUrl, payload, {
    headers: { 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` }
  });

  console.log(response.data.choices[0].message.content)
  return JSON.parse(response.data.choices[0].message.content);
}

 

async function main() {
// await splitScenesWithPrompts(storyContent);
 
}

main()
app.listen(8000,()=>{console.log("running successful")});