from flask import Flask, render_template, request, redirect, session, url_for
from models import db, User, CartItem

app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            return "User already exists"
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect('/login')
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username'], password=request.form['password']).first()
        if user:
            session['user_id'] = user.id
            return redirect('/home')
        else:
            return "Invalid credentials"
    return render_template('login.html')

@app.route('/home', methods=['GET', 'POST'])
def home():
    if 'user_id' not in session:
        return redirect('/login')
    if request.method == 'POST':
        item = request.form['item']
        quantity = request.form['quantity']
        cart_item = CartItem(item_name=item, quantity=int(quantity), user_id=session['user_id'])
        db.session.add(cart_item)
        db.session.commit()
    return render_template('home.html')

@app.route('/cart')
def cart():
    if 'user_id' not in session:
        return redirect('/login')
    items = CartItem.query.filter_by(user_id=session['user_id']).all()
    return render_template('cart.html', items=items)

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

# 👇 Add this at the very bottom of app.py

if __name__ == '__main__':
    app.run(debug=True)

