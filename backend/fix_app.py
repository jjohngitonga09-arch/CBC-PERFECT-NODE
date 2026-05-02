f = open('src/app.js', encoding='utf-8').read()

# Remove the misplaced auth block
f = f.replace("const _authRouter = require('./routes/auth');\napp.use('/api/auth', _authRouter);\n", '')

# Insert it before the 404 handler
f = f.replace("// 404", "const _authRouter = require('./routes/auth');\napp.use('/api/auth', _authRouter);\n\n// 404")

open('src/app.js', 'w', encoding='utf-8').write(f)
print('Fixed!')
