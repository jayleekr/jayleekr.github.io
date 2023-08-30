import openai

openai.api_key = "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"

def talk_with_chatbot(prompt):
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=3000,
        n=5,
        stop=None,
        temperature=0.5,
    )
    message = completions.choices[0].text
    return message

question1="""
My question was 

"I've teached python basics for those who are beginner in coding for a month. For a month, they've been tought 
basic control grammer in python (if else), data structure(dict, map) and how to use them by taking an example like opening 
an excel file and make it as an object in python code, then print them and save them as json file.
So my goal for three month include past month is to make them control or manupulate an excel file which contains massive measured data 
of elder people. To do so, they need to learn how to implement pre-processing logic in python and make them analyzed statistically.

Can you recommend a detailed plan for 2nd and 3rd month to teach them?
I want a very detailed version of plan like weekly syllabus"

"""
# answer=talk_with_chatbot(question1)

print("===============================================")
image_resp = openai.Image.create(prompt="two dogs playing chess, oil painting", n=4, size="512x512")
# print(answer)