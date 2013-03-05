/* SiteCatalyst code version: H.22.1.
Copyright 1996-2010 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */

var s_account=omniture.s_account;
var s=s_gi(s_account)
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
s.charSet="UTF-8"
/* Conversion Config */
s.currencyCode="USD"
/* Link Tracking Config */
s.trackDownloadLinks=true
s.trackExternalLinks=true
s.trackInlineStats=true
s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx"
s.linkInternalFilters="javascript:," + omniture.linkInternalFilters;
s.linkLeaveQueryString=false
s.linkTrackVars="None"
s.linkTrackEvents="None"


/* Plugin Config */
s.usePlugins=true

s.siteID="noPageName"
s.defaultPage="home"
//s.queryVarsList=""    
s.pathExcludeDelim=";"
s.pathConcatDelim=":"   
//s.pathExcludeList="" 

function s_doPlugins(s) {
	
	/* Set Page View Event */
	s.events=s.apl(s.events,'event1',',',2)
	
	/* Channel Manager - External Campaign Tracking */
	if(document.referrer.indexOf('shop.history.com')> -1){
		s.referrer = s.repl(document.referrer,'shop.history.com','shophistory.com');
	}
	
	/*channel Manager*/
	s.channelManager('cmpid,vid,et_cid','','','','s_dload',1);
	if(s._channel=="Natural Search")s._channel="Organic Search";
	if(s._channel=="Referrers")s._channel="Other 3rd Party Referral (Non-search)";
	
	s.eVar45=s.eVar46=s._channel;
	s.eVar47=s._campaign
	s.eVar48=s._keywords
	s.campaign=s._campaignID	
	
	/* Deduplicate referrer*/
	s.referrer=s.dedupeReferrer();
    
    /* Internal Campaign Tracking */
  	if(!s.eVar44) {
		s.eVar44=s.getQueryParam('intcmp');
		s.eVar44=s.getValOnce(s.eVar44,'ev44',0);
	}
	
	//Manual Internal Search
	if(s.prop17){
        s.prop17=s.prop17.toLowerCase();
        s.eVar17=s.prop17;
        s.eVar17=s.getValOnce(s.eVar17,'ev17',0);
        if(s.eVar17){
               s.events=s.apl(s.events,"event7",",",2);
        }
	}
	
	//Automated internal Search
	if(s.prop18){
        s.prop18=s.prop18.toLowerCase();
        s.eVar18=s.prop18;
        s.eVar18=s.getValOnce(s.eVar18,'ev18',0);
        if(s.eVar18){
               s.events=s.apl(s.events,"event51",",",2);
        }
	}
	
	/*ET email tracking*/
	s.eVar42=s.getQueryParam('et_cid');
	s.eVar42=s.getValOnce(s.eVar42,'ev42',0);
	
	s.eVar43=s.getQueryParam('et_rid');
	s.eVar43=s.getValOnce(s.eVar43,'ev43',0);
	
	/*getPagename if one is not set*/
	if(!s.pageType && !s.pageName)
		s.pageName=s.getPageName();
	
	/*Copy eVars to props via dynamic variables*/ 
	if(s.eVar1)s.prop1="D=v1";
	if(s.eVar2)s.prop2="D=v2";
	if(s.eVar3)s.prop3="D=v3";
	if(s.eVar4)s.prop4="D=v4";
	if(s.eVar5)s.prop5="D=v5";
	if(s.eVar6)s.prop6="D=v6";
	if(s.eVar7)s.prop7="D=v7";
	if(s.eVar8)s.prop8="D=v8";
	if(s.eVar9)s.prop9="D=v9";
	if(s.eVar10)s.prop10="D=v10";
	if(s.eVar11)s.prop11="D=v11";
	if(s.eVar12)s.prop12="D=v12";
	if(s.eVar13)s.prop13="D=v13";
	if(s.eVar14)s.prop14="D=v14";
	if(s.eVar15)s.prop15="D=v15";
	if(s.eVar16)s.prop16="D=v16";
	if(s.eVar19)s.prop19="D=v19";
	if(s.eVar20)s.prop20="D=v20";
	if(s.eVar21)s.prop21="D=v21";
	if(s.eVar22)s.prop22="D=v22";
	if(s.eVar23)s.prop23="D=v23";
	if(s.eVar24)s.prop24="D=v24";
	if(s.eVar25)s.prop25="D=v25";
	if(s.eVar26)s.prop26="D=v26";
	if(s.eVar27)s.prop27="D=v27";
	if(s.eVar28)s.prop28="D=v28";
	if(s.eVar29)s.prop29="D=v29";
	if(s.eVar30)s.prop30="D=v30";
	if(s.eVar31)s.prop31="D=v31";
	if(s.eVar32)s.prop32="D=v32";
	if(s.eVar33)s.prop33="D=v33";
	if(s.eVar34)s.prop34="D=v34";
	if(s.eVar35)s.prop35="D=v35";
	if(s.eVar36)s.prop36="D=v36";
	if(s.eVar37)s.prop37="D=v37";
	if(s.eVar38)s.prop38="D=v38";
	if(s.eVar39)s.prop39="D=v39";
	if(s.eVar40)s.prop40="D=v40";
	if(s.eVar41)s.prop41="D=v41";
	if(s.eVar42)s.prop42="D=v42";
	if(s.eVar43)s.prop43="D=v43";
	if(s.eVar44)s.prop44="D=v44";
	if(s.eVar45)s.prop45="D=v45";
	if(s.eVar47)s.prop47="D=v47";
	if(s.eVar48)s.prop48="D=v48";
	if(s.eVar49)s.channel="D=v49";
	if(s.campaign)s.prop49="D=v0";
	if(s.pageName)s.eVar51="D=pageName";
	
}
s.doPlugins=s_doPlugins
/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */

/*
 * Function - read combined cookies v 0.3
 */
if(!s.__ccucr){s.c_rr=s.c_r;s.__ccucr = true;
s.c_r=new Function("k",""
+"var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret"
+"urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i="
+"c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'"
+",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:"
+"m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get"
+"Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret"
+"urn v;");}

/*
 * Function - write combined cookies v 0.3
 */
if(!s.__ccucw){s.c_wr=s.c_w;s.__ccucw = true;
s.c_w=new Function("k","v","e",""
+"this.new2 = true;"
+"var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,"
+"c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s"
+".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr"
+"ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv"
+".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i"
+"ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())"
+"{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'"
+"='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t"
+".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i"
+"ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set"
+"Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");}

/*
 * Plugin: getQueryParam 2.3
 */
s.getQueryParam=new Function("p","d","u",""
+"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
+"1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
+"=p.length?i:i+1)}return v");
s.p_gpv=new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return ''");

/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
+"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)l=l?l+d+v:v;return l");

/*
 * Plugin: getValOnce_v1.0
 */
s.getValOnce=new Function("v","c","e",""
+"var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
+");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
+" v==k?'':v");

/*
 * Plugin: dedupeReferrer v1.0 - prevents the duplication of referrers
 */
s.dedupeReferrer=new Function("c","b",""
+"var s=this,a,g,i,j,k,l,m,n,o;g=s.referrer?s.referrer:document.refer"
+"rer;g=g.toLowerCase();if(g){i=g.indexOf('?')>-1?g.indexOf('?'):g.le"
+"ngth;j=g.substring(0,i);k=s.linkInternalFilters.toLowerCase();k=s.s"
+"plit(k,',');l=k.length;for(m=0;m<l;m++){n=j.indexOf(k[m])>-1?g:'';i"
+"f(n)o=n}if(!o){c=c?c:'_dr';b=b?b-1:'1';a=g;a=s.getValOnce(a,c,0);if"
+"(a){return a}else{return k[b]}}}");

/*
 * Utility Function: split v1.5 (JS 1.0 compatible)
 */
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/*
 * Plugin Utility: Replace v1.0
 */
s.repl=new Function("x","o","n",""
+"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+"substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*
 * Plugin: getPageName v2.1 - parse URL and return
 */
s.getPageName=new Function("u",""
+"var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/',"
+"x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s."
+"queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub"
+"string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i"
+"ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d"
+"efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;"
+"z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p."
+"substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x"
+";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s"
+"ubstring(x+1)}return n");

/*
 * channelManager v2.4 - Tracking External Traffic
 */
s.channelManager=new Function("a","b","c","d","e","f",""
+"var s=this,A,B,g,l,m,M,p,q,P,h,k,u,S,i,O,T,j,r,t,D,E,F,G,H,N,U,v=0,"
+"X,Y,W,n=new Date;n.setTime(n.getTime()+1800000);if(e){v=1;if(s.c_r("
+"e)){v=0}if(!s.c_w(e,1,n)){s.c_w(e,1,0)}if(!s.c_r(e)){v=0}}g=s.refer"
+"rer?s.referrer:document.referrer;g=g.toLowerCase();if(!g){h=1}i=g.i"
+"ndexOf('?')>-1?g.indexOf('?'):g.length;j=g.substring(0,i);k=s.linkI"
+"nternalFilters.toLowerCase();k=s.split(k,',');l=k.length;for(m=0;m<"
+"l;m++){B=j.indexOf(k[m])==-1?'':g;if(B)O=B}if(!O&&!h){p=g;U=g.index"
+"Of('//');q=U>-1?U+2:0;Y=g.indexOf('/',q);r=Y>-1?Y:i;t=g.substring(q"
+",r);t=t.toLowerCase();u=t;P='Referrers';S=s.seList+'>'+s._extraSear"
+"chEngines;if(d==1){j=s.repl(j,'oogle','%');j=s.repl(j,'ahoo','^');g"
+"=s.repl(g,'as_q','*')}A=s.split(S,'>');T=A.length;for(i=0;i<T;i++){"
+"D=A[i];D=s.split(D,'|');E=s.split(D[0],',');F=E.length;for(G=0;G<F;"
+"G++){H=j.indexOf(E[G]);if(H>-1){i=s.split(D[1],',');U=i.length;for("
+"k=0;k<U;k++){l=s.getQueryParam(i[k],'',g);if(l){l=l.toLowerCase();M"
+"=l;if(D[2]){u=D[2];N=D[2]}else{N=t}if(d==1){N=s.repl(N,'#',' - ');g"
+"=s.repl(g,'*','as_q');N=s.repl(N,'^','ahoo');N=s.repl(N,'%','oogle'"
+");}}}}}}}if(!O||f!='1'){O=s.getQueryParam(a,b);if(O){u=O;if(M){P='P"
+"aid Search'}else{P='Paid Non-Search';}}if(!O&&M){u=N;P='Natural Sea"
+"rch'}}if(h==1&&!O&&v==1){u=P=t=p='Direct Load'}X=M+u+t;c=c?c:'c_m';"
+"if(c!='0'){X=s.getValOnce(X,c,0);}g=s._channelDomain;if(g&&X){k=s.s"
+"plit(g,'>');l=k.length;for(m=0;m<l;m++){q=s.split(k[m],'|');r=s.spl"
+"it(q[1],',');S=r.length;for(T=0;T<S;T++){Y=r[T];Y=Y.toLowerCase();i"
+"=j.indexOf(Y);if(i>-1)P=q[0]}}}g=s._channelParameter;if(g&&X){k=s.s"
+"plit(g,'>');l=k.length;for(m=0;m<l;m++){q=s.split(k[m],'|');r=s.spl"
+"it(q[1],',');S=r.length;for(T=0;T<S;T++){U=s.getQueryParam(r[T]);if"
+"(U)P=q[0]}}}g=s._channelPattern;if(g&&X){k=s.split(g,'>');l=k.lengt"
+"h;for(m=0;m<l;m++){q=s.split(k[m],'|');r=s.split(q[1],',');S=r.leng"
+"th;for(T=0;T<S;T++){Y=r[T];Y=Y.toLowerCase();i=O.toLowerCase();H=i."
+"indexOf(Y);if(H==0)P=q[0]}}}if(X)M=M?M:'n/a';p=X&&p?p:'';t=X&&t?t:'"
+"';N=X&&N?N:'';O=X&&O?O:'';u=X&&u?u:'';M=X&&M?M:'';P=X&&P?P:'';s._re"
+"ferrer=p;s._referringDomain=t;s._partner=N;s._campaignID=O;s._campa"
+"ign=u;s._keywords=M;s._channel=P");

/* Custom Search Engine List */
s.seList="adelphia.net|q|adelphia.net>alot.com|q|alot.com>altavista.com|q|altavista.com>aolsearch.aol.com|q|aolsearch.aol.com>ask.com|q|ask.com>askkids.com|q|askkids.com>att.net|q|att.net>bearshare.com|q|bearshare.com>become.com|q|become.com>bellsouth.net|q|bellsouth.net>blingo.com|q|blingo.com>centurylink.net/search|q|centurylink.net/search>charter.net/google|q|charter.net/google>charter.net/search|q|charter.net/search>comcast.net|q|comcast.net>comparisonwarehouse.com|q|comparisonwarehouse.com>crawler.com|q|crawler.com>cox.net|q|cox.net>cs.com|q|cs.com>dealtime.com|q|dealtime.com>dogpile.com|q|dogpile.com>earthlink.net|q|earthlink.net>encyclopedia.com/searchresults|q|encyclopedia.com/searchresults>excite.com|q|excite.com>findarticles.com|q|findarticles.com>freeze.com|q|freeze.com>gawwk.com|q|gawwk.com>goodsearch.com/search|q|goodsearch.com/search>hulu.com/search|q|hulu.com/search>hulu.com/videos/search|q|hulu.com/videos/search>images.google|q|images.google>info.com|q|info.com>information.com|q|information.com>infospace.com|q|infospace.com>live.com|q|live.com>lycos.com|q|lycos.com>my.att.net|q|my.att.net>mysearch.com|q|mysearch.com>myway.com|q|myway.com>mywebsearch.com|q|mywebsearch.com>need2find.com|q|need2find.com>nettrekker.com/results|q|nettrekker.com/results>netscape.com|q|netscape.com>nettrekker.com|q|nettrekker.com>oingo.com|q|oingo.com>opendns.com|q|opendns.com>optimum.net/search|q|optimum.net/search>optonline.net|q|optonline.net>ovguide.com|q|ovguide.com>paran.net/search|q|paran.net/search>peoplepc.com|q|peoplepc.com>puresight.com|q|puresight.com>query.nytimes.com/search|q|query.nytimes.com/search>quickbrowsersearch.com|q|quickbrowsersearch.com>rr.com|q|rr.com>search.alot.com|q|search.alot.com>search.aol.com|q|search.aol.com>search.babylon.com|q|search.babylon.com>search.bt.com|q|search.bt.com>search.cnn.com|q|search.cnn.com>search.comcast.net|q|search.comcast.net>search.conduit.com|q|search.conduit.com>search.daum.net|q|search.daum.net>search.earthlink.net|q|search.earthlink.net>search.freecause.com|q|search.freecause.com>search.imesh.com|q|search.imesh.com>search.juno.com|q|search.juno.com>search.mywebsearch.com|q|search.mywebsearch.com>search.nate.com|q|search.nate.com>search.netzero.net|q|search.netzero.net>search.ovguide.com|q|search.ovguide.com>search.peoplepc.com|q|search.peoplepc.com>search.rr.com|q|search.rr.com>search.seznam.cz|q|search.seznam.cz>search.sweetim.com|q|search.sweetim.com>search.windstream.net|q|search.windstream.net>search-results.com|q|search-results.com>searchforvideo.com|q|searchforvideo.com>searchportal.information.com|q|searchportal.information.com>searchvideo.com|q|searchvideo.com>shopping.com|q|shopping.com>smarter.com|q|smarter.com>smoothfinder.com|q|smoothfinder.com>starware.com/dp/search|q|starware.com/dp/search>suddenlink.net|q|suddenlink.net>suite101.com/search|q|suite101.com/search>sympatico.msn.ca|q|sympatico.msn.ca>tattoodle.com|q|tattoodle.com>toseeka.com|q|toseeka.com>truveo.com|q|truveo.com>tv.com/search|q|tv.com/search>verizon.net/central|q|verizon.net/central>viewpoint.com|q|viewpoint.com>virgilio.it|q|virgilio.it>webcrawler.com|q|webcrawler.com>yandex.ru|q|yandex.ru>zoomtown.com|q|zoomtown.com>search.nifty.com|text|@nifty>100.nu|q|100.nu>searches.org|search|1001 Searches>100hot.com|query,general|100Hot>123.cl|words|123.cl>1st-spot.net|query|1st-Spot>2look4it.com|query,k|2Look4It>37.com|q|37.com>www.3721.com/|p|3721.com>search.com|qu|7search.com>suchen.abacho.de|q|Abacho - Germany>194.231.30.245,abacho.com|q|Abacho.com>search.about.com|terms|About.com>abrexa.co.uk|q|Abrexa UK>www.acesearch.co.uk|keyword|AceSearch>www.adfree4u.com|keywords|AdmCity>afterpage.com|search_item|Afterpage>blue.ah-ha.com|query|ah-ha>shopping.search.jp|key|Aladdin>alcanseek.com|q|Alcanseek>alltheweb.com|query,q|All The Web>allsearchengines.co.uk|querys|AllSearchEngines>telefrance.com|query|allZone>altavista.co|q,r|AltaVista>ca.altavista.com|q|AltaVista - Canada>dk.altavista.com|q|AltaVista - Denmark>fr.altavista.com|q,r|AltaVista - France>altavista.de|q,r|AltaVista - Germany>it.altavista.com|q,r|AltaVista - Italy>nl.altavista.com|q|AltaVista - Netherlands>no.altavista.com|q|AltaVista - Norway>es.altavista.com|q,r|AltaVista - Spain>se.altavista.com|q,r|AltaVista - Sweden>ch.altavista.com|q,r|AltaVista - Switzerland>uk.altavista.com|q,r|AltaVista - United Kingdom>ananzi.co.za|qt|Ananzi>p-search.virtualave.net|keyword|Andromeda Search>www.anzwers.com|query|ANZWERS>aol.fr|q|AOL - France>suche.aol.de,suche.aolsvc.de|q|AOL - Germany>aol.co.uk,search.aol.co.uk|query|AOL - United Kingdom>search.aol.com,search.aol.ca|query,q|AOL.com Search>apali.com|buscar|Apali>aport.ru|r|Aport>ask.jp|q|Ask - Japan>ask.com,ask.co.uk|ask,q|Ask Jeeves>atlas.cz|q|Atlas.cz>au.anzwers.yahoo.com|p|au.Anzwers>lookabout.stormpages.com|q|AussieSeek>www.austronaut.at|begriff|AustroNaut>www.baidu.com|wd,word|Baidu>beguide.com|search|BeGuide.com>bellnet.de|suchstr|Bellnet>beocity.com|keywords|Beocity>berlingske.dk|search|Berlingske>search.biglobe.ne.jp|q|Biglobe>search.bluewin.ch,search.bluewindow.ch|q,qry|Blue Window>buscapique.com|phrase|BUSCApique>business.com/search|query|Business.com>buyersindex.com|query|BuyersIndex>bytesearch.com|search,q|ByteSearch>cafesta.com|keyword,keywords|Cafesta>*bogus*Canada.com*bogus*|QRY,qkw,searchfor|Canada.com>centrum.cz|q|Centrum.cz>chubba.com|arg|Chubba>clix.pt|question|Clix>cnet.search.com|q|CNET Search.com>search.cnn.com|query|CNN Web Search>columbus-finder.de|search|Columbus-Finder>search.comcast.net|q|Comcast Search>conexcol.com|query|Conexcol>crooz.jp|query|Crooz>cuil.com|q|Cuil>search.curryguide.com|query|CurryGuide>hermia.com,cyberbritain.co.uk|qry|CyberBritain.com>data.ru|text|Data.ru>daum.net,search.daum.net|q|Daum>dazzo.com|search|Dazzo!>www.dejanews.com|QRY|DejaNews>deoji.com|search,k|Deoji>dialindia.com|keyword|DialIndia>Dictionary.com,Dictionary|term,query,q|Dictionary.com>www.dino-online.de|query|Dino Online>dion.excite.co.jp|search|Dion>dir.bg|s|Dir.bg>directhit.com|qry,q|DirectHit>search.dmoz.com,dmoz.com|search|Dmoz>doginfo.com|search|dog.com>dogpile.com|q|Dogpile>dreamwiz.com,search.dreamwiz.com|q|DreamWiz>search.earthlink.net|q|Earthlink Search>www.eerstekeuze.nl/|Terms|eerstekeuze.nl>egyptsearch.com|keyword|EgyptSearch>empas.com,search.empas.com|q|Empas>enhance.com|Q|Enhance>eniro.dk|search_word|Eniro>eniro.fi|search_word|Eniro - Finland>eniro.se|search_word|Eniro - Sweden>euregio.net|we_lv_search_0|Euregio>euroseek.com|query,string|Euroseek>msxml.excite.com|qkw,s|Excite>excite.com.au|search,key|Excite - Australia>nl.excite.com|search|Excite - Dutch>excite.fr|search,q|Excite - France>www.excite.de|search,q,s|Excite - Germany>excite.co.jp|search,s|Excite - Japan>excitesearch.netscape.com,searchexcite.netscape.com|general,search|Excite - Netscape>www.excite.ca,search.excite.ca|search|Excite Canada>excite.ch|search,q|Excite.ch>exploora.com.br|busca|Exploora>fansites.com|q1|Fansites.com>fastsearch.com|query|Fast>feynd.com|search|Feynd>finalsearch.com|pattern|Final Search>find.wanadoo.nl/|Keywords|find.wanadoo.nl>findit-quick.com|Terms|Findit-Quick>findwhat.com|mt|FindWhat>fireball.de|q,query|Fireball>fishhoo.com|query|FishHoo!>fleecethenet.co.uk|keyword|FleeceTheNet>flix.de|stichwort|Flix.de>search.fresheye.com|ord,kw|FreshEye>item.froute.jp,search.froute.jp|k|Froute>fullwebinfo.com|k|FullWebinfo Directory & Search Engine>galileu.com|kw|Galileu>generalsearch.com|keyword|General Search>geoboz.com|search|GeoBoz Search>globecrawler.com|search|Globe Crawler>themegaweb.com|q|globito!>infoseek.go.com|qt|Go (Infoseek)>go2net.com|general|Go2net Metacrawler>godado.it|Keywords|Godado>goeureka.com.au|q,key|GoEureka>gohip.com|sc|GoHip>search.mobile.goo.ne.jp|MT|Goo (Japan)>goo.ne.jp|MT|Goo (Jp.)>google.co,googlesyndication.com|q,as_q|Google>google.com.af|q,as_q|Google - Afghanistan>google.as|q,as_q|Google - American Samoa>google.com.ai|q,as_q|Google - Anguilla>google.com.ag|q,as_q|Google - Antigua and Barbuda>google.com.ar|q,as_q|Google - Argentina>google.am|q,as_q|Google - Armenia>google.com.au|q,as_q|Google - Australia>google.at|q,as_q|Google - Austria>google.az|q,as_q|Google - Azerbaijan>google.com.bh|q,as_q|Google - Bahrain>google.com.bd|q,as_q|Google - Bangladesh>google.com.by|q,as_q|Google - Belarus>google.be|q,as_q|Google - Belgium>google.com.bz|q,as_q|Google - Belize>google.com.bo|q,as_q|Google - Bolivia>google.ba|q,as_q|Google - Bosnia-Hercegovina>google.co.bw|q,as_q|Google - Botswana>google.com.br|q,as_q|Google - Brasil>google.vg|q,as_q|Google - British Virgin Islands>google.com.bn|q,as_q|Google - Brunei>google.bg|q,as_q|Google - Bulgaria>google.bi|q,as_q|Google - Burundi>google.com.kh|q,as_q|Google - Cambodia>google.ca|q,as_q|Google - Canada>google.cl|q,as_q|Google - Chile>google.cn|q,as_q|Google - China>google.com.co|q,as_q|Google - Colombia>google.co.ck|q,as_q|Google - Cook Islands>google.co.cr|q,as_q|Google - Costa Rica>google.ci|q,as_q|Google - Cote D\'Ivoire>google.hr|q,as_q|Google - Croatia>google.com.cu|q,as_q|Google - Cuba>google.cz|q,as_q|Google - Czech Republic>google.dk|q,as_q|Google - Denmark>google.dj|q,as_q|Google - Djibouti>google.dm|q,as_q|Google - Dominica>google.com.do|q,as_q|Google - Dominican Republic>google.com.ec|q,as_q|Google - Ecuador>google.com.eg|q,as_q|Google - Egypt>google.com.sv|q,as_q|Google - El Salvador>google.ee|q,as_q|Google - Estonia>google.com.et|q,as_q|Google - Ethiopia>google.com.fj|q,as_q|Google - Fiji>google.fi|q,as_q|Google - Finland>google.fr|q,as_q|Google - France>google.de|q,as_q|Google - Germany>google.gr|q,as_q|Google - Greece>google.gl|q,as_q|Google - Greenland>google.gp|q,as_q|Google - Guadeloupe>google.com.gt|q,as_q|Google - Guatemala>google.gg|q,as_q|Google - Guernsey>google.gy|q,as_q|Google - Guyana>google.ht|q,as_q|Google - Haiti>google.hn|q,as_q|Google - Honduras>google.com.hk|q,as_q|Google - Hong Kong>google.hu|q,as_q|Google - Hungary>google.co.in|q,as_q|Google - India>google.co.id|q,as_q|Google - Indonesia>google.ie|q,as_q|Google - Ireland>google.is|q,as_q|Google - Island>google.com.gi|q,as_q|Google - Isle of Gibraltar>google.im|q,as_q|Google - Isle of Man>google.co.il|q,as_q|Google - Israel>google.it|q,as_q|Google - Italy>google.com.jm|q,as_q|Google - Jamaica>google.co.jp|q,as_q|Google - Japan>google.je|q,as_q|Google - Jersey>google.jo|q,as_q|Google - Jordan>google.kz|q,as_q|Google - Kazakhstan>google.co.ke|q,as_q|Google - Kenya>google.ki|q,as_q|Google - Kiribati>google.co.kr|q,as_q|Google - Korea>google.kg|q,as_q|Google - Kyrgyzstan>google.la|q,as_q|Google - Laos>google.lv|q,as_q|Google - Latvia>google.co.ls|q,as_q|Google - Lesotho>google.com.ly|q,as_q|Google - Libya>google.li|q,as_q|Google - Liechtenstein>google.lt|q,as_q|Google - Lithuania>google.lu|q,as_q|Google - Luxembourg>google.mw|q,as_q|Google - Malawi>google.com.my|q,as_q|Google - Malaysia>google.mv|q,as_q|Google - Maldives>google.com.mt|q,as_q|Google - Malta>google.mu|q,as_q|Google - Mauritius>google.com.mx|q,as_q|Google - Mexico>google.fm|q,as_q|Google - Micronesia>google.md|q,as_q|Google - Moldova>google.mn|q,as_q|Google - Mongolia>google.ms|q,as_q|Google - Montserrat>google.co.ma|q,as_q|Google - Morocco>google.com.na|q,as_q|Google - Namibia>google.nr|q,as_q|Google - Nauru>google.com.np|q,as_q|Google - Nepal>google.nl|q,as_q|Google - Netherlands>google.co.nz|q,as_q|Google - New Zealand>google.com.ni|q,as_q|Google - Nicaragua>google.com.ng|q,as_q|Google - Nigeria>google.nu|q,as_q|Google - Niue>google.com.nf|q,as_q|Google - Norfolk Island>google.no|q,as_q|Google - Norway>google.startsiden.no|q,as_q|Google - Norway (Startsiden)>google.com.om|q,as_q|Google - Oman>google.com.pk|q,as_q|Google - Pakistan>google.com.pa|q,as_q|Google - Panama>google.com.py|q,as_q|Google - Paraguay>google.com.pe|q,as_q|Google - Peru>google.com.ph|q,as_q|Google - Philippines>google.pn|q,as_q|Google - Pitcairn Islands>google.pl|q,as_q|Google - Poland>google.pt|q,as_q|Google - Portugal>google.com.pr|q,as_q|Google - Puerto Rico>google.com.qa|q,as_q|Google - Qatar>google.cd|q,as_q|Google - Rep. Dem. du Congo>google.cg|q,as_q|Google - Rep. du Congo>google.ge|q,as_q|Google - Repulic of Georgia>google.ro|q,as_q|Google - Romania>google.ru|q,as_q|Google - Russia>google.rw|q,as_q|Google - Rwanda>google.sh|q,as_q|Google - Saint Helena>google.com.vc|q,as_q|Google - Saint Vincent and the Grenadine>google.ws|q,as_q|Google - Samoa>google.sm|q,as_q|Google - San Marino>google.st|q,as_q|Google - Sao Tome and Principe>google.com.sa|q,as_q|Google - Saudi Arabia>google.sn|q,as_q|Google - Senegal>google.sc|q,as_q|Google - Seychelles>google.com.sg|q,as_q|Google - Singapore>google.sk|q,as_q|Google - Slovakia>google.si|q,as_q|Google - Slovenia>google.com.sb|q,as_q|Google - Solomon Islands>google.co.za|q,as_q|Google - South Africa>google.es|q,as_q|Google - Spain>google.lk|q,as_q|Google - Sri Lanka>google.se|q,as_q|Google - Sweden>google.ch|q,as_q|Google - Switzerland>google.com.tw|q,as_q|Google - Taiwan>google.com.tj|q,as_q|Google - Tajikistan>google.co.th|q,as_q|Google - Thailand>google.bs|q,as_q|Google - The Bahamas>google.gm|q,as_q|Google - The Gambia>google.tp|q,as_q|Google - Timor-Leste>google.tk|q,as_q|Google - Tokelau>google.to|q,as_q|Google - Tonga>google.tt|q,as_q|Google - Trinidad and Tobago>google.com.tr|q,as_q|Google - Turkey>google.tm|q,as_q|Google - Turkmenistan>google.co.ug|q,as_q|Google - Uganda>google.com.ua|q,as_q|Google - Ukraine>google.ae|q,as_q|Google - United Arab Emirates>google.co.uk|q,as_q|Google - United Kingdom>google.com.uy|q,as_q|Google - Uruguay>google.co.uz|q,as_q|Google - Uzbekiston>google.vu|q,as_q|Google - Vanuatu>google.co.ve|q,as_q|Google - Venezuela>google.com.vn|q,as_q|Google - Viet Nam>google.co.vi|q,as_q|Google - Virgin Islands>google.co.yu|q,as_q|Google - Yugoslavia>google.co.zm|q,as_q|Google - Zambia>google.co.zw|q,as_q|Google - Zimbabwe>ezsch.ezweb.ne.jp|query|Google @ EZweb>grippo.com.ar|query|Grippo>help-site.com|p|Help-Site>heureka.hu|heureka|Heureka>highway61.com|string,query|Highway61>hispavista.com|cadena|HispaVista>holms.ru|s|Holms.ru>hotbot.lycos.com|MT,query|HotBot>hotbot.co.uk|query|Hotbot - United Kingdom>hotindex.com|keyword|HotIndex>hotlaunch.com|search,strSearch|HotLaunch.com>huifa.cl|key|Huifa>icqit.com|q|icq>searchidea.com|search,keywords|Idea Web>idealist.com|search|idealist.com>www.ilse.nl|SEARCH_FOR,search_for|Ilse>search.ilse.nl|search_for|ilse.nl>infinisearch.net|s|InfiniSearch>Infohiway|query,k|Infohiway>search.infomak.com|words|InfoMak>www.seeq.com|keyword|InfoPage.com>infoseek.co.uk|qt|InfoSeek>infoseek.de|qt,query|InfoSeek - Germany>infoseek.co.jp|qt|Infoseek - Japan>infospace.com|QKW,qhqn|InfoSpace>infotiger.com|qs|InfoTiger>internet-times.com|search,query|Internet Times>internettrash.com|words|InternetTrash>istmania.com/belice|Terms|Istmania>i-stores.com|query,k|i-Stores>rank.stars.ru|search,r|IT InfoArt Stars>iwon.com|searchfor|iWon>ixquick.com|query|ixquick>jayde.com|query|Jayde>virtualpromote.com|search|JimWorld Open Directory>jopinet.com|busca|Jopinet>soeg.jubii.dk|soegeord,query|Jubii>kanoodle.com|query|Kanoodle.com>kazazz.com|search,query|KaZaZZ>dk.kelkoo.com|Query|Kelkoo - Denmark>no.kelkoo.com|siteSearchQuery|Kelkoo - Norway>kelkoo.se|siteSearchQuery|Kelkoo - Sweden>khoj.com|keyword|Khoj>kolumbus.fi|q|Kolumbus>kvasir.no|q,searchExpr|Kvasir>brujula.net/brazil|query|La Brujula>libero.it|query|Libero>arianna.libero.it|query|Libero-Ricerca>limeysearch.co.uk|q|Limey Search>linkcentre.com,linkcentre|keyword|Linkcentre>linkopedia.com|query|Linkopedia>bing.com|q|Microsoft Bing>dir.m.livedoor.com|q,keyword|Livedoor - Mobile>search.livedoor.com|q|Livedoor.com>locate.com|query,show|Locate>lokace.com|MOTCLEF|Lokace>looksmart.com,looksmart.co.uk|key,qt|LookSmart>loquax.co.uk|search|Loquax Open Directory>luxpoint.lu|Terms|LuXPoint>www.lycos.com,search.lycos.com|query|Lycos>lycos.fr|query|Lycos - France>lycol.de,search.lycos.de|query|Lycos - Germany>lycos.it|query|Lycos - Italy>lycol.nl|query|Lycos - Netherlands>lycos.es|query|Lycos - Spain>lycos.co.uk|query|Lycos - United Kingdom>magellan|search|Magellan>mail.ru/search,go.mail.ru/search|q|Mail.ru>mamma.com|query|Mamma>marchsearch.com,search.curryguide.com|query|MarchSearch>aaa.com.au|terms,query|Matilda>matkurja.com/slo|keys|Mat\'Kurja>mcfind.com|search|McFind.com>www.metacrawler.com,search.metacrawler.com|general|Metacrawler>216.15.219.34,216.15.192.226|qry|Metacrawler - Germany>metapro.com,metadog.com|search,keyword|MetaDog.com>metaeureka.com|terms|metaEureka>metagopher.com|query|MetaGopher>metaiq|search,qry,query|MetaIQ.com>bing.com|q|Microsoft Bing>mirago.co.uk|qry|Mirago>s.mbga.jp|q|Mobagee Search>monstercrawler.com|qry|Monster Crawler>bing.com|q|Microsoft Bing>multimeta.com|q|MultiMeta>mygo.com|qry|myGO>myway.com|searchfor|MyWay.com>nate.com,search.nate.com|query|Nate.com>search.NationalDirectory.com|query|National Directory>naver.com,search.naver.com|query|Naver>nbci.com|keyword,qkw|NBCi>netbreach.com|search,query|NetBreach>net-fetch.com|search|Net-Fetch.com Web Directory>netfinderusa.com|search|NetFinder USA>netgoat.com|search,k|NetGoat>netscape.com|query,search|Netscape Search>netsearchvoyager.com,netsearch.org|Terms,search|NetSearch>netsprint.pl|qt|NetSprint>nexet.net|SEARCH,q|Nexet Open Directory>search.nifty.com|q|Nifty>search.ninemsn.com.au|q|NineMSN>nomade.fr|s,MT|Nomade>www.northernlight.com|qr|Northern Light>ntsearch.com|qq|NTsearch>odn.excite.co.jp|search|ODN>officialsearch.com|qs|Official Search>soeg.ofir.dk|kw|Ofir>ohnew.co.jp|k|Oh! New? Mobile>oingo.com|s,q|Oingo>onwashington.com|string|onwashington.com>dmoz.org|search|Open Directory Project>optimum.net|q|Optimum Search>overture.com|Keywords|Overture>search.oznetwork.com.au|Terms|Ozsearch>ozu.es|q|Ozu>pandia.com|search|Pandia Plus>pngnetsearch.com|query,k|Papua New Guinea Search>passagen.se|q|Passagen>pi.net/zoeken|googleq|Planet - Zoekpagina>point2.com|search_string|Point2>polishworld.com|keyword|PolishWorld>powersearch.com|Q|Power Search>PremierStores.com|query|Premier Stores Directory>se.pricerunner.com|q|Pricerunner.se>profusion.com|queryterm|Profusion>interavisos.hypermart.net|search|Proyecto Celeste>qksearch.com|query|QkSearch>quepasa.com|q|Quepasa>questfinder.com,questfinder.net|s|QuestFinder>rageworld.com|search|RageWorld.com>rambler.ru/srch|words|Rambler>reference.com|q|Reference.com>rex-search.com,rex-search.com|terms|Rex Search>dxpnet.com|i|Riot>search.rr.com|qs|RoadRunner Search>rocketlinks.com|keywords|RocketLinks.com>rol.ro|s|ROL.ro>savvysearch.com,savvy.search.com|q|SavvySearch>scopie.com|search,s|Scopie>scour.com|query|Scour>scrubtheweb.com|keyword,Terms|Scrub the Web>centre.ru|query|Search Centre>searchcity.co.uk|search,keyword|Search City>searchiberia.com|q|Search Iberia>searchking.com|searchterm,keyword|Search King>searchviking.com|search|Search Viking>search.ch|q|Search.ch>search.irl.com|q|Search.IRL.com>searchalot.com|query,q|Searchalot>searchit.com|query,keywords|SearchIt>searchnz.co.nz|q|SearchNZ>searchport.org|search,terms|Searchport>ad.searchteria.co.jp|p|Searchteria>sensis.com.au|find|Sensis.com.au>serbiancafe.com|search|SerbianCafe>sesam.no/search|q|Sesam>seznam|w|Seznam.cz>sherlock.cz|retezec|Sherlock.cz>simplesearch.com|search|Simple Search>simplypets.com|searchTerms,q|SimplyPets.com>google.cn/search?client=aff-sina|q|Sina - China>google.sina.com.hk|word|Sina - Hong Kong>google.sina.com|search_key|Sina - North America>google.sina.com.tw|kw|Sina - Taiwan>smartbeak.com|SEARCH_TEXT|SmartBeak.com>smartpages.com|QueryString|SmartPages.com>home.snap.com|keyword,KW|Snap>.sol.es|q|Sol>soneraplaza.fi|qt|Sonera Plaza>so-net.search.goo.ne.jp|MT|So-net>soquick.com|search,q|SoQuick.com>southasia.net|search|SouthAsia.net>spiderbot.net|Terms,searWords|SpiderBot>splatsearch.com|searchstring|Splat!>spray.se|query|Spray>starmedia.com|q|Starmedia>stpt.com|query,QRY,SEARCH|Starting Point>abcsok.no|q|Startsiden>thestomp.hypermart.net|search|Stomp!>search.stopat.com|p1|StopAt>suche.ch|q|Suche.ch>suchmaschine.com|suchstr|Suchmaschine>sunbrain.com|search|Sun Brain>supersnooper.com|SearchString|Super Snooper>supercrawler.com|k|Supercrawler.com>supereva.it|q|Supereva>search.metajump.com|w|Surf Gopher>surf.sk|find|Surf.sk>surfboard.nl|query|Surfboard (Ixquick)>www.surfer.ch|query|Surfer.ch>swift.kerna.ie|text|Swift Guide>szm.sk|WS|szm.sk>tapuz.co.il|q|Tapuz>teoma.com|q|Teoma>terra.es|query|Terra>www.theglobe.com,globelists.theglobe.com|Keywords|The Globe Search>thenet1.com|s,keyword|The Net 1>thebestmall.com|query,q|theBestMall>thebrazilbridge.com|query|TheBrazilBridge>theinfodepot.com|search,Terms|theinfodepot.com>theyellowpages.com|search|TheYellowPages>thunderstone.com|q|Thunderstone>tipmoto.com|keywords|TipMoto>tiscali.it|key|Tiscali>tjohoo.se|manualkeyword|Tjohoo>todocl.cl|query|TodoCl>togglebot.com|search,query|ToggleBot!>toile.com|query,q|Toile du Quebec>www.topfile.com|query|TopFile.com>totalseek.com|query|totalSEEK>pagemontreal.com|text1|toutMontreal>www.track.nl/|qr|track.nl>trovator.com|qu|Trovator>truesearch.com|query|TrueSearch.com>search.ukmax.com|MT|UK Max>ukplus.com|key|UK Plus>uksearcher.co.uk|qry|UK Searcher>ukindex.co.uk|stext|ukindex>busca.uol.com.br|q|UOL Busca>usseek.com|string|Usseek>directory.verita.com|search,Query|Verita>vietgate.net|q|VietGate>vinden.nl|query|Vinden>vindex.nl|search_for|Vindex>virgilio.it|qs|Virgilio>voila.fr|kw|Voila>netsearch.org,www.netsearchvoyager.com|qry,qry_str|Voyager>wakwak.com|MT|WAKWAK>walla.co.il|q|Walla>search.wanadoo.co.uk|q|Wanadoo>waypages.com|qt|Waypages>webwombat.com|I,ix|Web Wombat>webwombat.com.au|I,ix|Web Wombat (Au.)>web.de|su|Web.de>webalta.ru|q|Webalta>webbel.be|q|Webbel>www.webcrawler.com|searchText,search|WebCrawler>webpath.net|query|Webpath>www.web-search.com|q|Web-Search>webstudio.fi|sana|WebStudio>webtop.com|search|WebTop>wepa.com|query|Wepa>whatsnu.com|search|WhatsNu>intra.whatUseek.com|query,arg|WhatUSeek>wp.pl|szukaj|Wirtualna Polska>wisenut.com|q|WiseNut>wizzler.com|qry,query|Wizzler.com>worldlight.com|query,q|Worldlight>wow.pl|q|WOW>woyaa.com|query|WoYaa>yahoo.com,search.yahoo.com|p|Yahoo!>ar.yahoo.com,ar.search.yahoo.com|p|Yahoo! - Argentina>asia.yahoo.com,asia.search.yahoo.com|p|Yahoo! - Asia>au.yahoo.com,au.search.yahoo.com|p|Yahoo! - Australia>at.search.yahoo.com|p|Yahoo! - Austria>br.yahoo.com,br.search.yahoo.com|p|Yahoo! - Brazil>ca.yahoo.com,ca.search.yahoo.com|p|Yahoo! - Canada>qc.yahoo.com,cf.search.yahoo.com|p|Yahoo! - Canada (French)>ct.yahoo.com,ct.search.yahoo.com|p|Yahoo! - Catalan>cn.yahoo.com,search.cn.yahoo.com|p|Yahoo! - China>chinese.yahoo.com|p|Yahoo! - Chinese (US)>dk.yahoo.com,dk.search.yahoo.com|p|Yahoo! - Denmark>fi.search.yahoo.com|p|Yahoo! - Finland>fr.yahoo.com,fr.search.yahoo.com|p|Yahoo! - France>de.yahoo.com,de.search.yahoo.com|p|Yahoo! - Germany>hk.yahoo.com,hk.search.yahoo.com|p|Yahoo! - Hong Kong>in.yahoo.com,in.search.yahoo.com|p|Yahoo! - India>id.yahoo.com,id.search.yahoo.com|p|Yahoo! - Indonesia>it.yahoo.com,it.search.yahoo.com|p|Yahoo! - Italy>yahoo.co.jp,search.yahoo.co.jp|p,va|Yahoo! - Japan>kids.yahoo.com,kids.yahoo.com/search|p|Yahoo! - Kids>kr.yahoo.com,kr.search.yahoo.com|p|Yahoo! - Korea>malaysia.yahoo.com,malaysia.search.yahoo.com|p|Yahoo! - Malaysia>mx.yahoo.com,mx.search.yahoo.com|p|Yahoo! - Mexico>nl.yahoo.com,nl.search.yahoo.com|p|Yahoo! - Netherlands>nz.yahoo.com,nz.search.yahoo.com|p|Yahoo! - New Zealand>no.yahoo.com,no.search.yahoo.com|p|Yahoo! - Norway>ph.yahoo.com,ph.search.yahoo.com|p|Yahoo! - Philippines>ru.yahoo.com,ru.search.yahoo.com|p|Yahoo! - Russia>sg.yahoo.com,sg.search.yahoo.com|p|Yahoo! - Singapore>es.yahoo.com,es.search.yahoo.com|p|Yahoo! - Spain>telemundo.yahoo.com,espanol.search.yahoo.com|p|Yahoo! - Spanish (US : Telemundo)>se.yahoo.com,se.search.yahoo.com|p|Yahoo! - Sweden>ch.search.yahoo.com|p|Yahoo! - Switzerland>tw.yahoo.com,tw.search.yahoo.com|p|Yahoo! - Taiwan>th.yahoo.com,th.search.yahoo.com|p|Yahoo! - Thailand>uk.yahoo.com,uk.search.yahoo.com|p|Yahoo! - UK and Ireland>vn.yahoo.com,vn.search.yahoo.com|p|Yahoo! - Viet Nam>mobile.yahoo.co.jp|p|YahooJapan - Mobile>yandex|text|Yandex.ru>yeehaa.com|request,query|Yeehaa>yehey.com|q|Yehey>search.goo.ne.jp/yomiuri|queryword|YOL>zbozi.cz|q|Zbozi.cz>www.zensearch.com|q|ZenSearch>www.zoek.nl|query,q|Zoek>zoeken.hetnet.nl/|q|zoeken.hetnet.nl";

s.socialNetworks=".habbo.,.stickam.,100zakladok.ru,2linkme,2tag.nl,7L"
+"ive7.com,a1-webmarks.com,add.io,Adifni.com,aerosocial.com,amenme.co"
+"m,arto.com,baang.ir,badoo.com,bebo.com,Bentio.com,bigadda.com,bit.l"
+"y,bizsugar.com,blackplanet.com,bleetbox.com/,blinklist.com,blogmark"
+"s.net,blogtrottr.com,blurpalicious.com,boardlite.com,Bookmarky.cz,b"
+"ookmerken.de,bordom.net,Box.net,brainify.com,buddymarks.com,budurl."
+"com,buzz.yahoo.com,buzz.yahoo.com,buzznet.com,buzzzy.com,cafemom.co"
+"m,camyoo.com,care2.com,chiq.com,cirip.ro,citeulike.org,cl.ik,classi"
+"calplace.com,cli.gs,cndig.org,Colivia.de,colombia.gacetilla.org,cos"
+"miq.de,cyworld.co.kr,cyworld.com,cyworld.ifensi.com,delicious.com,d"
+"esignbump.com,deviantart.com,digg.com,diggita.it,diglog.com,diigo.c"
+"om,dipdive.com,domelhor.net,dosti.webdunia.com,dotnetkicks.com,dotn"
+"etshoutout.com,douban.com,draugiem.lv,drimio.com,dropjack.com,dzone"
+".com,edelight.de,ekudos.nl,elefanta.pl,embarkons.com,eweri.com,extr"
+"aplay.com,ezyspot.com,fabulously40.com,facebook.com,fark.com,farkin"
+"da.com,favable.com,faves.com,favlog.com,favoritus.com,flaker.pl,fli"
+"ckr.com,flixter.com,Floss.pro,folkd.com,followtags.com,forceindya.c"
+"om,fotolog.com,foursquare.com,fresqui.com,friendfeed.com,friendsreu"
+"nited.com,friendster.com,funp.com,fwisp.com,Gabbr.com,gamekicker.co"
+"m,geni.com,givealink.org,gravee.com,greaterdebater.com,grono.net,gr"
+"umper.org,haber.gen.tr,hadash-hot.co.il,hatena.com,hazarkor.co.il,h"
+"ellotxt.com,Hex.io,hi5.com,hipstr.com,hitmarks.com,hotbmark.com,hot"
+"klix.com,hyves.nl,ibibo.com,idearef.com,Idek.net,identi.ca,ihavegot"
+".com,informazione.it,instapaper.com,is.gd,isociety.org,iwiw.hu,jame"
+"spot.com,jisko.net,jumptags.com,kaboodle.com,kaevur.com,kipup.com,k"
+"irtsy.com,kiwibox.com,kl.am,kledy.de,kommenting.com,koornk.com,laai"
+"k.it,ladenzeile.de,last.fm,librerio.com,lifestream.aol.com,linkagog"
+"o.com,linkedin.com,linkninja.com.br,linkshares.net,linkuj.cz,livejo"
+"urnal.com,lockerblogger.com,lynki.com,mawindo.com,meccho.com,mediap"
+"ratique.com,meinvz.net,mekusharim.walla.co.il,memori.ru,meneame.net"
+",mister-wong.com,mixi.jp,mixx.com,mobile.itsmy.com,mocospace.com,mo"
+"emesto.ru,mototagz.com,multiply.com,multiply.com,my.opera.com,myher"
+"itage.com,mylife.com,mypage.rediff.com,myspace.com,myyearbook.com,n"
+"4g.com,nasza-klasa.pl,netlog.com,netvibes.com,netvouz.com,newstrust"
+".net,newsvine.com,nexopia.com,ninjalink.com,nujij.nl,odnoklassniki."
+"ru,oknotizie.virgilio.it,oneview.com,orkut.com,osmosus.com,oyyla.co"
+"m,pimpthisblog.com,ping.fm,planyp.us,plaxo.com,plurk.com,plurl.us,p"
+"osteezy.com,posterous.com,prati.ba,propeller.com,pusha.se,qzone.qq."
+"com,reddit.com,redkum.com,renren.com,scoop.at,segnalo.virgilio.it,s"
+"ekoman.lv,shaveh.co.il,shetoldme.com,short.ie,simpy.com,skyrock.com"
+",slashdot.org,smi.ru,sn.im,snipr.com,snipurl.com,snurl.com,social-b"
+"ookmarking.net,sodahead.com,sonico.com,sonico.com,spaces.live.com,s"
+"peedtile.net,sphinn.com,sportpost.com,springpadit.com,spruzer.com,s"
+"quidoo.com,startaid.com,startlap.hu,storyfollower.com,strands.com,s"
+"tudivz.net,stuffpit.com,stumbleupon.com,stumpedia.com,stylehive.com"
+",surfpeople.net,svejo.net,symbaloo.com,tagged.com,tagmarks.de,tagvn"
+".com,tagza.com,technorati.com,thewebblend.com,thisnext.com,tinyurl."
+"com,tipd.com,tr.im,transferr.com,tuenti.com,tulinq.com,tusul.com,tw"
+"eetmeme.com,twitter.com,twitthis.com,twurl.nl,viadeo.com,visitezmon"
+"site.com,vkontakte.ru,vyoom.com,webnews.com,weeworld.com,windycitiz"
+"en.com,wirefan.com,wykop.pl,xanga.com,xing.com,yammer.com,yardbarke"
+"r.com,yazzem.com,yigg.de,yoolink.fr,yoolink.to,yorumcuyum.com,youbo"
+"okmarks.com,youmob.com,zakladok.net,zanatic.com";

s.mrss="ask.com/video,bing.com/videos/search,blinkx.com/video,casttv."
+"com,channel.com/#/,clipblast.com/#search,fancast.com/search,firston"
+"mars.com,fooooo.com/search,hulu.com/search,hulu.com/videos/search,i"
+"mdb.com/search/videos,pixsy.com/search,purevideo.com/video,search.l"
+"ive.com/video,search.msn.com/video,search.ovguide.com,searchforvide"
+"o.com,truveo.com,video.aol.com/video-search,video.filestube.com,vid"
+"eo.google.com/videosearch,video.search.yahoo.com,video.tvguide.com,"
+"vidsea.com,tbs=vid,tv.com/search";

s.crossNetwork="aetv.com,biography.com,dressupchallenge.com,lifetimem"
+"oms.com,.history.com,mylifetime.com,roiworld.com,historyinternation"
+"al.com,historyenespanol.com,mothersclick.com,momblognetwork.com,aet"
+"n.com,historychannel.tv,aetvn.com,aetninternational.com,aetnadsales"
+".com,aetnjustclick.com,type-h.com"

s._extraSearchEngines="baidu.com|q|Baidu"


s._channelDomain="Social|"+s.socialNetworks+",zooloo.com>MRSS|"+s.mrss+",zuula.com/video_srch>Cross Network|"+s.crossNetwork+",consideraetv.com>Partner Sites|shophistory.com" 
s._channelPattern="Social Media|Social_>MRSS|MRSS_>Cross-Network|CNP_>Partner Sites|Partner_>Paid Search|PaidSearch_>Consumer Marketing|ConsumerMarketing|ConsumerMarketing_>Paid Media|PaidMedia_>Email|Email_";

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
s.trackingServer="metrics.aetn.com"
s.trackingServerSecure="smetrics.aetn.com"
s.visitorMigrationKey="4E6284CB"
s.visitorMigrationServer=omniture.visitorMigrationServer;
s.visitorMigrationServerSecure=omniture.visitorMigrationServerSecure;


/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s._c='s_c';s.wd=window;if(!s.wd.s_c_in){s.wd.s_c_il=new Array;s.wd.s_c_in=0;}s._il=s.wd.s_c_il;s._in=s.wd.s_c_in;s._il[s._in]=s;s.wd.s_c_in++;s"
+".an=s_an;s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=func"
+"tion(o){if(!o)return o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.indexOf('filter')<0)n[x]=o[x];return n};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexO"
+"f(x.substring(p,p+1))<0)return 0;return 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3)"
+"return encodeURIComponent(x);else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.substring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%"
+"16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}return y}else{x=s.rep(escape(''+x),'+','%2B');if(c&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if"
+"(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}}}return x};s.epa=function(x){var s=this;if(x){x=''+x;return s.em==3?de"
+"codeURIComponent(x):unescape(s.rep(x,'+',' '))}return x};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.l"
+"ength;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.f"
+"sf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.si=function(){var s=this,i,k,v,c="
+"s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)=='string')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}"
+"c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var"
+" s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('"
+".',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s."
+"epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NON"
+"E'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()"
+"+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i]."
+"o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv"
+">=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,"
+"'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s"
+".t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs="
+"p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,"
+"l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,0,r.t,r.u)}};s.br=function(id,rs){var s=this;if(s.disableBufferedRequests||!s.c_w('s_br',rs))s.brl=rs};s.flushBufferedReques"
+"ts=function(){this.fbr(0)};s.fbr=function(id){var s=this,br=s.c_r('s_br');if(!br)br=s.brl;if(br){if(!s.disableBufferedRequests)s.c_w('s_br','');s.mr(0,0,br)}s.brl=0};s.mr=function(sess,q,rs,id,ta,u"
+"){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if"
+"(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s"
+".ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/H.22.1/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047);if(id){s.br(id,rs);return}}if(s.d.images&&s.apv>=3"
+"&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+']."
+"mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e',"
+"'this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if((!ta||ta=='_self'||ta="
+"='_top'||(s.wd.name&&ta==s.wd.name))&&rs.indexOf('&pe=')>=0){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0"
+" alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl="
+"function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,l,a,b='',c='',t;if(x){y=''+x;i=y.indexOf('?');if(i>0){a=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase()"
+";i=0;if(h.substring(0,7)=='http://')i+=7;else if(h.substring(0,8)=='https://')i+=8;h=h.substring(i);i=h.indexOf(\"/\");if(i>0){h=h.substring(0,i);if(h.indexOf('google')>=0){a=s.sp(a,'&');if(a.lengt"
+"h>1){l=',q,ie,start,search_key,word,kw,cd,';for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c){y+='?'+b+'&'"
+"+c;if(''+x!=y)x=y}}}}}}return x};s.hav=function(){var s=this,qs='',fv=s.linkTrackVars,fe=s.linkTrackEvents,mn,i;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].tr"
+"ackVars;fe=s[mn].trackEvents}}fv=fv?fv+','+s.vl_l+','+s.vl_l2:'';for(i=0;i<s.va_t.length;i++){var k=s.va_t[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(v&&k!='linkName'&&k!='l"
+"inkType'){if(s.pe||s.lnk||s.eo){if(fv&&(','+fv+',').indexOf(','+k+',')<0)v='';if(k=='events'&&fe)v=s.fs(v,fe)}if(v){if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pa"
+"geURL'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&&s.visitorMigra"
+"tionServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1';else if(s.em="
+"=2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k=='currencyCode"
+"')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascriptVersion')q='j"
+"';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='homepage')q='hp'"
+";else if(k=='plugins')q='p';else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+q+'='+(k.substring(0,3)"
+"!='pev'?s.ape(v):v)}}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t"
+")return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExt"
+"ernalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)"
+"!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=s.co(this);s.t"
+"();s.lnk=0;if(b)return this[b](e);return true');s.bc=new Function('e','var s=s_c_il['+s._in+'],f,tcf;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;s.eo=e.srcElement?e.srcElement:e.target;tcf=new Functi"
+"on(\"s\",\"var e;try{if(s.eo&&(s.eo.tagName||s.eo.parentElement||s.eo.parentNode))s.t()}catch(e){}\");tcf(s);s.eo=0');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.inde"
+"xOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'"
+"')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE'"
+")t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p"
+"=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' '"
+",'');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100"
+");o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&"
+"s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,'"
+",','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[u"
+"n]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Ob"
+"ject.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq"
+"[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o"
+".onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie|"
+"|!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener)s.b.addEventListener('click',s.bc,false);else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=func"
+"tion(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e)"
+")return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.subst"
+"ring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowe"
+"rCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};"
+"s.sa=function(un){var s=this;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_"
+"l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Ar"
+"ray('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.le"
+"ngth;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0"
+";if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf("
+"\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl."
+"length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexO"
+"f('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadMo"
+"dule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else "
+"g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],"
+"o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!"
+"o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javas"
+"cript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,"
+"f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.vo1=function(t,a){if(a[t]"
+"||a['!'+t])this[t]=a[t]};s.vo2=function(t,a){if(!a[t]){a[t]=this[t];if(!a[t])a['!'+t]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.d"
+"ll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.d"
+"l=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.pt(s.vl_g,',','vo2',vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.t=fun"
+"ction(vo,id){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate("
+")+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Objec"
+"t;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1'"
+";if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try"
+"{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c="
+"screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWid"
+"th;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp="
+"tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.f"
+"l(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=c"
+"t;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.pt(s.vl_g,',','vo2',vb);s.pt(s.vl_g,',','vo1',vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.wd.location,r=tfs.document.referrer"
+";if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk;if(!o)return '';var p=s.pageName,w=1,t=s.ot(o)"
+",n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';t=s.ot(o);n=s.oid(o);x=o.s_oidt}oc=o.onclick?''+o.onclick:''"
+";if((oc.indexOf(\"s_gs(\")>=0&&oc.indexOf(\".s_oc(\")<0)||oc.indexOf(\".tl(\")>=0)return ''}if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName"
+";t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l))q+='&pe=lnk_'+(t=='d'||t=='e'?s.ape(t):'o')+(h?'&pev1='+s.ape(h):'')+(l?'&pev2='+s.ape(l):'');else trk=0;if(s.trackInlineStats){if(!p){p="
+"s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot="
+"'+s.ape(t)+(i?'&oi='+i:'')}}if(!trk&&!qs)return '';s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,id,ta);qs='';s.m_m('t');if(s.p_r)s.p_r("
+");s.referrer=''}s.sq(qs);}else{s.dl(vo);}if(vo)s.pt(s.vl_g,',','vo1',vb);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_link"
+"Name=s.wd.s_linkType='';if(!id&&!s.tc){s.tc=1;s.flushBufferedRequests()}return code};s.tl=function(o,t,n,vo){var s=this;s.lnk=s.co(o);s.linkType=t;s.linkName=n;s.t(vo)};if(pg){s.wd.s_co=function(o)"
+"{var s=s_gi(\"_\",1,1);return s.co(o)};s.wd.s_gs=function(un){var s=s_gi(un,1,1);return s.t()};s.wd.s_dc=function(un){var s=s_gi(un,1);return s.t()}}s.ssl=(s.wd.location.protocol.toLowerCase().inde"
+"xOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var ap"
+"n=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.isope"
+"ra=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv="
+"parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=="
+"'%U0100'?1:0))}s.sa(un);s.vl_l='dynamicVariablePrefix,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLi"
+"fetime,pageName,pageURL,referrer,currencyCode';s.va_l=s.sp(s.vl_l,',');s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,products,linkName,"
+"linkType';for(var n=1;n<76;n++)s.vl_t+=',prop'+n+',eVar'+n+',hier'+n+',list'+n;s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browse"
+"rHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests"
+",mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadF"
+"ileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,_1_referrer';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);if(!ss)s.wds()",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,s;if(un){un=un.toLowerCase();if(l)for(i=0;i<l.length;i++){s=l[i];if(!s._c||s._c=='s_c'){if(s.oun==un)return s;else if(s.fs&&s.sa&&s.fs(s.oun,un)){s.sa(un);return s}}}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a>=5&&v.indexOf('Opera')<0&&u.indexOf('Opera')<0){w.s_c=new Function("un","pg","ss","var s=this;"+c);return new s_c(un,pg,ss)}else s=new Function("un","pg","ss","var s=new Object;"+s_ft(c)+";return s");return s(un,pg,ss)}
