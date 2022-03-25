const mapSelVals = (value) => {
    _maps = {'lt 15 mins': 15/60,
            '15 mins': 15/60,
            '30 mins': 30/60,
            '45 mins': 45/60,
            '1 hour': 1,
            '1 hour 15': 1 + 15/60,
            '1 hour 30': 1 + 30/60,
            '1 hour 45': 1 + 45/60,
            '2 hour': 2,
            '2 hour 15': 2 + 15/60,
            '2 hour 30': 2 + 30/60,
            '2 hour 45': 2 + 45/60,
            'gt 1 hour': 1,
            'gt 2 hour': 2,
            'gt 3 hours': 3
    }
    return _maps[value];
}

v = mapSelVals('gt 1 hour');

console.log(v)