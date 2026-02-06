import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom right, #09090b, #18181b)',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
        }}
      >
        {/* Navbar Simulation */}
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '20px 40px',
                borderBottom: '1px solid #27272a',
                background: '#09090b'
            }}
        >
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>Loot Lens</div>
            <div style={{ display: 'flex', gap: '20px', fontSize: 20, color: '#a1a1aa' }}>
                <div>Dashboard</div>
                <div>Tasks</div>
                <div>Hideout</div>
            </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 60, fontWeight: 900, margin: 0, background: 'linear-gradient(to right, #fff, #a1a1aa)', backgroundClip: 'text', color: 'transparent' }}>
                Loot Lens
            </h1>
            <p style={{ fontSize: 30, color: '#e4e4e7', margin: '20px 0 10px 0', fontWeight: 'bold' }}>
                Escape from Tarkov Item Tracker
            </p>
            <p style={{ fontSize: 24, color: '#a1a1aa', margin: 0 }}>
                タルコフ アイテム 必要数 管理・ハイドアウト・タスク
            </p>
        </div>

        {/* Simulated Cards Grid */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '60px', opacity: 0.8 }}>
            {/* Card 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '160px', height: '180px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '15px' }}>
                <div style={{ width: '100%', height: '80px', background: '#27272a', borderRadius: '8px', marginBottom: '10px' }}></div>
                <div style={{ width: '80%', height: '12px', background: '#3f3f46', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '50%', height: '12px', background: '#3f3f46', borderRadius: '4px' }}></div>
            </div>
             {/* Card 2 */}
             <div style={{ display: 'flex', flexDirection: 'column', width: '160px', height: '180px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '15px' }}>
                <div style={{ width: '100%', height: '80px', background: '#27272a', borderRadius: '8px', marginBottom: '10px' }}></div>
                <div style={{ width: '80%', height: '12px', background: '#3f3f46', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '50%', height: '12px', background: '#3f3f46', borderRadius: '4px' }}></div>
            </div>
             {/* Card 3 */}
             <div style={{ display: 'flex', flexDirection: 'column', width: '160px', height: '180px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '15px' }}>
                <div style={{ width: '100%', height: '80px', background: '#27272a', borderRadius: '8px', marginBottom: '10px' }}></div>
                <div style={{ width: '80%', height: '12px', background: '#3f3f46', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '50%', height: '12px', background: '#3f3f46', borderRadius: '4px' }}></div>
            </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
