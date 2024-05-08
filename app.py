from flask import Flask, render_template, request,jsonify
import csv
from datetime import datetime, timedelta
from openai import OpenAI
from pathlib import Path
import statistics
import math

app = Flask(__name__)

users = {'MAC000323': 'test_user'}
daily_data_past_week=[]
monthly_data_past12=[]
sysprompt=""""""
messages=[]


def get_score(user_data, acorn_data):
    scores = []
    
    for user_month, acorn_month in zip(user_data, acorn_data):
        total_difference = 0
        
        # Extract year and month from the user data
        user_year = int(user_month['year'])
        user_month_number = int(user_month['month'])
        
        # Calculate the previous month and year
        if user_month_number == 1:  # If current month is January
            previous_month_number = 12
            previous_year = user_year - 1
        else:
            previous_month_number = user_month_number - 1
            previous_year = user_year
        
        # Find the previous consumption data
        previous_consumption = None
        for prev_user_month in user_data:
            if int(prev_user_month['year']) == previous_year and int(prev_user_month['month']) == previous_month_number:
                previous_consumption = float(prev_user_month['total_consumption'])
                break
        
        if previous_consumption is None:
            # If previous consumption data is not found, use current consumption
            previous_consumption = float(user_month['total_consumption'])
        
        for time_period in ['morning', 'afternoon', 'evening', 'night', 'total_consumption']:
            user_consumption = float(user_month[time_period])
            acorn_consumption = float(acorn_month['avg_' + time_period])
            
            user_difference = abs(user_consumption - previous_consumption) / previous_consumption * 100
            acorn_difference = abs(user_consumption - acorn_consumption) / acorn_consumption * 100
            
            # Weights for user's own consumption and acorn's consumption (can be adjusted)
            user_weight = 0.7
            acorn_weight = 0.3
            
            # Combine differences with weights
            combined_difference = (user_weight * user_difference) + (acorn_weight * acorn_difference)
            
            total_difference += combined_difference
        
        average_difference = total_difference / 5  # 5 time periods
        
        # Normalize to a scale of 0 to 100
        # score = 100 - average_difference
        
        scores.append((average_difference-100)/10)
    
    return math.floor(statistics.mean(scores))




def load_daily_data(filename,username):
    data = []
    with open(Path(filename), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if username==row['LCLid']:
                data.append(row)

    return data

def load_acorn_data(filename,username):
    data = []
    with open(Path(filename), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if username==row['LCLid']:
                return row['Acorn']
    return 'ACORN-B'

def load_acorn_avg_data(filename,acorn):
    data = []
    with open(Path(filename), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if acorn==row['acorn']:
                data.append(row)
    return data
    

def load_monthly_data(filename,username):
    data = []
    with open(Path(filename), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if username==row['LCLid']:
                data.append(row)
    return data

def get_data_for_lclid_daily(lclid, data,past_time):
    current_date = datetime.strptime("2014-01-01", "%Y-%m-%d")  # Start of January 2014
    past_week_date=current_date-timedelta(days=past_time)
    filtered_data = []
    filtered_data_pastweek=[]
    for row in data:
        if row['LCLid'] == lclid:
            row_date = datetime.strptime(row['day'], "%Y-%m-%d")
            if current_date>row_date >= current_date - timedelta(days=past_time):
                filtered_data.append(row)
            elif past_week_date>row_date >= past_week_date - timedelta(days=past_time):
                filtered_data_pastweek.append(row)
   
    return [filtered_data,filtered_data_pastweek]

def get_data_for_lclid_monthly(lclid, data,past_time):
    current_date = datetime.strptime("2014-01-01", "%Y-%m-%d")  # Start of January 2014
    filtered_data = []
    for row in data:
        if row['LCLid'] == lclid:
            row_date = datetime.strptime(f"{row['year']}-{row['month']}-01", "%Y-%m-%d")
            
            if current_date>row_date >= current_date - timedelta(days=past_time):
                filtered_data.append(row)
   
    return filtered_data


def converDataUser(data_dict):
    factor = 10
    dataUser = {
        "LCLid": data_dict["LCLid"],
        "morning": "{:.3f}".format(float(data_dict["morning"])*factor),  
        "afternoon": "{:.7f}".format(float(data_dict["afternoon"])*factor),  
        "evening": "{:.7f}".format(float(data_dict["evening"])*factor),  
        "night": "{:.3f}".format(float(data_dict["night"])*factor),  
        "total_consumption": "{:.7f}".format(float(data_dict["total_consumption"])*factor), 
        "month": data_dict["day"].split('-')[1],
        "year": data_dict["day"].split('-')[0]  
    }
    return dataUser

def avgAcorn(avg_acorn):
    factor = 3
    dataAverage = {
        avg_acorn['acorn']: avg_acorn['acorn'],
        "avg_morning": "{:.9f}".format(float(avg_acorn["avg_morning"]) *factor),
        "avg_afternoon": "{:.9f}".format(float(avg_acorn["avg_afternoon"]) *factor), 
        "avg_evening": "{:.8f}".format(float(avg_acorn["avg_evening"]) *factor), 
        "avg_night": "{:.9f}".format(float(avg_acorn["avg_night"]) *factor),  
        "avg_total_consumption": "{:.8f}".format(float(avg_acorn["avg_total_consumption"]) *factor),  
        "month": avg_acorn['month'],
        "year": avg_acorn["year"]
    }

    return dataAverage



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    global sysprompt, messages
    if 'test_user' == password:
        daily_data = load_daily_data('Data/Daily/block1_all_lids_dailyhours.csv', username)
        daily_data_past_week = get_data_for_lclid_daily(username, daily_data, 7)
        monthly_data = load_monthly_data('Data/Monthly/block1_consolidated_usage_by_month.csv', username)
        monthly_data_past12 = get_data_for_lclid_monthly(username, monthly_data, 375)
        
        messages = [{"role": "system", "content": sysprompt}]

        acorn = load_acorn_data('Data/informations_households.csv',username)
        avg_acorn_data = load_acorn_avg_data('Data/acorn_monthly_averages.csv',acorn)
        score=get_score(monthly_data,avg_acorn_data)
        sysprompt = """You are an energy assistant. You are named EnsightAI. You have to summarize the data for the user. The dashboard has charts. 
        1) The bargraph shows comparison between energy consumption this week and last week. This is the data that is being used. The first list 
        is for the current week and the second list is for the previous week: """ + str(daily_data_past_week) + """
        2) The donut chart shows consumption based on the part of the day i.e. Morning, Afternoon, Evening, Night. The data is """ + str(daily_data_past_week[0][-1]) + """
        3) The line chart shows the monthly consumption for the past year: """ + str(monthly_data_past12) + """
        4) The Energy usage score is calculated on the basis of past usage and comparison with other users from same groups based on conditions. The energy score is """+ str(score)+ """
        5) The radial chart compares users usage with other users from similar group
        Answer any questions the user has. Also, make insights into the data.
        Keep it short
        """
        
        

        return render_template('dashboard.html', username=username, daily=daily_data_past_week, monthly=monthly_data_past12,
                                score=score, avg_acorn_data=avg_acorn_data)
    
    else:
        return "Invalid credentials. <a href='/'>Try again</a>"

@app.route('/chat')
def chat():
    global messages, sysprompt
    if gpt_key is None:
        raise KeyError('GPT Api Key missing') 
    messages = [{"role": "system", "content": sysprompt}]
    return render_template('chat.html')

gpt_key=None
# Get response from GPT
@app.route('/get-response', methods=['POST'])
def get_response():
    data = request.get_json()
    user_message = data['message']
    client = OpenAI(api_key=gpt_key)
    messages.append({"role":"user","content":user_message})
    response = client.chat.completions.create(messages=messages,
    model="gpt-3.5-turbo",)
    messages.append({"role":"assistant","content":response.choices[0].message.content})
    return jsonify({'response': response.choices[0].message.content})

if __name__ == '__main__':
    app.run(debug=True)