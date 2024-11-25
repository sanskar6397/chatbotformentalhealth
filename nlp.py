#!/usr/bin/env python
# coding: utf-8

# In[1]:


import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
import json
import random
import pickle
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD


# In[2]:


lemmatizer = WordNetLemmatizer()


# In[3]:


data_file = open(r'C:\Users\amang\Desktop\ChatBot\intents.json').read()
intents = json.loads(data_file)


# In[4]:


# Initialize variables
words = []
classes = []
documents = []
ignore_words = ['?', '!']


# In[5]:


# Tokenizing and lemmatizing
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenize each word
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        # Add documents in the corpus
        documents.append((w, intent['tag']))
        # Add to classes list
        if intent['tag'] not in classes:
            classes.append(intent['tag'])


# In[6]:


# Lemmatize and lower each word and remove duplicates
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))


# In[7]:


# Sort classes
classes = sorted(list(set(classes)))


# In[8]:


# Documents = combination of patterns and intents
print(len(documents), "documents")
print(len(classes), "classes", classes)
print(len(words), "unique lemmatized words", words)


# In[9]:


# Save words and classes using pickle
pickle.dump(words, open('texts.pkl', 'wb'))
pickle.dump(classes, open('labels.pkl', 'wb'))


# In[10]:


# Create training data
training = []
# Create an empty array for output
output_empty = [0] * len(classes)


# In[11]:


# Training set: bag of words for each sentence
for doc in documents:
    # Initialize bag of words
    bag = []
    # List of tokenized words for the pattern
    pattern_words = doc[0]
    # Lemmatize each word
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]
    # Create bag of words
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    
    # Output is '0' for each tag, '1' for the current tag
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    
    training.append([bag, output_row])


# In[12]:


# Shuffle the training data and convert to np.array
random.shuffle(training)
training = np.array(training, dtype=object)


# In[13]:


# Split into features (X) and labels (Y)
train_x = list(training[:, 0])
train_y = list(training[:, 1])
print("Training data created")


# In[14]:


import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers.legacy import SGD  # For the legacy SGD optimizer


# In[15]:



# Define and compile the model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Use the legacy optimizer
sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model
hist = model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)

# Save the model
model.save(r'C:\Users\amang\Desktop\ChatBot\model.h5')
print("Model created and saved")

# Load the model to verify it saved correctly
loaded_model = tf.keras.models.load_model(r'C:\Users\amang\Desktop\ChatBot\model.h5')
loaded_model.summary()


# In[ ]:




