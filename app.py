#!/usr/bin/env python
# coding: utf-8

# In[2]:


from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np


# In[3]:


# Initialize Flask app
app = Flask(__name__)


# In[4]:


# Load the model
model = tf.keras.models.load_model('C://Users//amang//Desktop//ChatBot//model.h5')


# In[5]:


@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from the request
    data = request.json  # Expecting JSON format { "features": [values] }
    
    # Convert input to numpy array
    input_data = np.array(data['features']).reshape(1, -1)  # Adjust shape as needed
    
    # Make a prediction
    prediction = model.predict(input_data)
    
    # Return the prediction
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False) 


# In[ ]:




