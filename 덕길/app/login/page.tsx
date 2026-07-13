import Link from "next/link";
import { Mark, Screen } from "../ui";

export default function LoginPage(){return <Screen className="auth-screen"><main className="auth-body"><div className="auth-brand"><Mark/><strong>덕길이</strong></div><div className="auth-copy"><p>행사 가는 모든 순간,</p><h1>덕길이가 가장 좋은<br/>다음 행동을 알려드려요.</h1></div><div className="auth-visual"><span className="route-node">⌂</span><i/><span className="route-ai">✦</span><i/><span className="route-node">★</span></div><button className="google-button"><b>G</b> Google로 계속하기</button><p className="auth-switch">아직 회원이 아니신가요? <Link href="/signup">회원가입</Link></p><small className="terms">계속하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.</small></main></Screen>}
