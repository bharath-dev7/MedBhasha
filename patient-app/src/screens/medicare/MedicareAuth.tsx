import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareAuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const MedicareAuth: React.FC<MedicareAuthProps> = ({ onBack, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState('Dr. Balu / Ramesh');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [email, setEmail] = useState('user@medicare.health');
  const [password, setPassword] = useState('••••••••');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localDb.setCurrentUser({
      fullName: isLogin ? 'Verified User' : fullName,
      mobile,
      email,
      isLoggedIn: true,
    });
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 600);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px 30px 24px',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '50%',
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
          }}
        >
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          {isLogin
            ? 'Sign in to access your prescriptions and reminders.'
            : 'Register to manage medicines, get expiry alerts & verification.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {!isLogin && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Full Name
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
              }}
            >
              <User size={18} color="#64748B" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                required
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '15px',
                  color: '#0F172A',
                }}
              />
            </div>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Mobile Number
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            }}
          >
            <Phone size={18} color="#64748B" />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98765 43210"
              required
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                color: '#0F172A',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Email Address
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            }}
          >
            <Mail size={18} color="#64748B" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                color: '#0F172A',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            {isLogin ? 'Password' : 'Create Password'}
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            }}
          >
            <Lock size={18} color="#64748B" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                color: '#0F172A',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button
            type="submit"
            className="medicare-btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          >
            {submitted ? (
              <>
                <CheckCircle2 size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'Login' : 'Register'}</span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976D2',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

