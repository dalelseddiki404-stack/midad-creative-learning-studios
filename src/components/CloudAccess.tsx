import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import '@lovable.dev/cloud-auth-js/styles.css';

export function CloudAccess({ onSignedIn, onSignedOut, message }: { onSignedIn?: () => void; onSignedOut?: () => void; message?: string }) {
  const [signedIn,setSignedIn]=useState(false);
  useEffect(()=>{
    void supabase.auth.getSession().then(({data})=>setSignedIn(!!data.session));
    const {data} = supabase.auth.onAuthStateChange(event=>{
      if(event==='SIGNED_IN') {setSignedIn(true); onSignedIn?.();}
      if(event==='SIGNED_OUT') {setSignedIn(false); onSignedOut?.();}
    });
    return ()=>data.subscription.unsubscribe();
  },[onSignedIn,onSignedOut]);
  const login = async(provider:'google'|'lovable')=>{
    const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:window.location.origin+window.location.pathname});
    if(result.error) toast.error('تعذر تسجيل الدخول؛ حاولي مرة أخرى');
  };
  return <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-border py-4">
    {signedIn ? <><span className="text-sm">الحفظ لحسابك متاح</span><Button variant="outline" onClick={async()=>{await supabase.auth.signOut();}}>تسجيل الخروج</Button></> : <><span className="text-sm">{message ?? 'سجّلي الدخول لحفظ أعمالك لحسابك؛ تبقى أعمال الجهاز متاحة.'}</span><Button className="google-auth-button" variant="outline" onClick={()=>login('google')}><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>المتابعة باستخدام Google</Button><Button className="lovable-auth-button" onClick={()=>login('lovable')}>Continue with Lovable</Button></>}
  </div>;
}