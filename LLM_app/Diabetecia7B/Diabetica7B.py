from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# Load model and tokenizer on CUDA (GPU)
model_path = "WaltonFuture/Diabetica-7B"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16
).to(device).eval()

tokenizer = AutoTokenizer.from_pretrained(model_path)

# Request format
class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate/")
async def generate_text(request: PromptRequest):
    input_ids = tokenizer(request.prompt, return_tensors="pt").input_ids.to("cuda")

    output_ids = model.generate(
        input_ids=input_ids,
        max_new_tokens=2048,  
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id
    )

    response_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    generated = response_text[len(request.prompt):].strip()

    return {
        "input": request.prompt,
        "output": generated
    }

import uvicorn

if __name__ == "__main__":
    
    uvicorn.run(app, host="localhost", port=8001)