import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { MembersList } from '../components/members/members-list/members-list';
import { MemberDetailed } from '../components/members/member-detailed/member-detailed';
import { Lists } from '../components/lists/lists';
import { Messages } from '../components/messages/messages';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    // Creiamo una sorta di rotta fittizia che abbia le rotte figlie in pancia per mettere tutto sotto auth guard senza dover scrivere riga per riga i passaggi
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MembersList },
            { path: 'members/:id', component: MemberDetailed },
            { path: 'lists', component: Lists },
            { path: 'chat', component: Messages },
        ]
    },
    { path: '**', component: Home }, //Page not found
];
