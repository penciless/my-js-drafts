root()
route()
layout()

root('www.abc.com')
route(['/home'])
layout([
    div({ class: 'heading' })([
        'Welcome to my app FW!!!'
    ]),
    div([
        'Your gender:',
        label([
            input({ type: 'radio', name: 'gender' }),
            span([ 'Male' ])
        ]),
        label([
            input({ type: 'radio', name: 'gender' }),
            span([ 'Female' ])
        ])
    ]),
    div(route({
        '/overview': layout(PageOverview),
        '/detail': layout(PageDetail),
        '/table': component(DetailTable),
        '/list': div([
            ul([
                data([ { id: 1, name: 'abc' }, { id: 2, name: 'def' } ])
                .template(li([ 'Item',  ]))
            ])
        ])
    })),
    component(Footer)
])
private({
    onSelectGender: function() {
        console.log();
    }
})
public({
    getGender: function() {
        return null;
    }
})