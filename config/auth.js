module.exports = {

    'facebookAuth' : {
        'clientID'      : '336304570192367', // your App ID
        'clientSecret'  : '83bbddf5f0f6aef3d93f622ca484f2ef', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }};